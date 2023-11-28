import { EventEmitter } from 'events';
import HttpServer from './http_server'; 
import DnsServer from './dns_server';
import * as fs from 'fs';
import * as path from 'path';

interface DaemonConfig {
  httpPort: number;
  dnsPort: number;
  hostRoot: string;
}

export default class Daemon extends EventEmitter {

  configuration: DaemonConfig;

  httpServer: HttpServer;
  dnsServer: DnsServer;

  restartFilename: string;
  watcher: fs.FSWatcher;

  starting = false;
  stopping = false;
  started = false;

  constructor(configuration: DaemonConfig) {
    super();
    
    this.configuration = configuration;
    
    this.httpServer = new HttpServer(this.configuration);
    this.dnsServer = new DnsServer(this.configuration);
    
    process.on('SIGINT', this.stop);
    process.on('SIGTERM', this.stop);
    process.on('SIGQUIT', this.stop);
    
    const hostRoot = this.configuration.hostRoot;
    this.restartFilename = path.join(hostRoot, 'restart.txt');
    
    this.on('start', () => {
      this.watcher = fs.watch(hostRoot, {persistent: false}, this.hostRootChanged);
    });
    
    this.on('stop', () => {
      this.watcher?.close();
    })
  }

  hostRootChanged = () => {
    fs.exists(this.restartFilename, exists => {
      if (exists) {
        this.restart(); 
      }
    });
  }

  restart = () => {
    fs.unlink(this.restartFilename, err => {
      if (!err) {
        this.emit('restart');
      }
    });
  }

  start = () => {
    if (this.starting || this.started) {
      return;
    }
    
    this.starting = true;
    
    const { httpPort, dnsPort } = this.configuration;
    
    const startServer = (server: any, port: number, callback: (err: any) => void) => {
      process.nextTick(() => {
        try {
          server.on('error', callback);
          
          server.once('listening', () => {
            server.removeListener('error', callback);
            callback();  
          });
          
          server.listen(port);
        } catch (err) {
          callback(err);
        }
      });
    }
    
    const pass = () => {
      this.starting = false;
      this.started = true;
      this.emit('start');
    }
    
    const flunk = (err: any) => {
      this.starting = false;
      try { this.httpServer.close(); } catch (e) {}
      try { this.dnsServer.close(); } catch (e) {}
      this.emit('error', err);
    }
    
    startServer(this.httpServer, httpPort, (err) => {
      if (err) {
        flunk(err);
      } else {
        startServer(this.dnsServer, dnsPort, (err) => {
          if (err) {
            flunk(err);
          } else {
            pass();
          }  
        });
      }
    });
  }

  stop = () => {
    if (this.stopping || !this.started) {
      return; 
    }
    
    this.stopping = true;
    
    const stopServer = (server: any, callback: () => void) => {
      process.nextTick(() => {
        try {
          const close = () => {
            server.removeListener('close', close);
            callback();
          }
          server.on('close', close);
          server.close();
        } catch (err) {
          callback(err);
        }
      });
    }
    
    stopServer(this.httpServer, () => {
      stopServer(this.dnsServer, () => {
        this.stopping = false;
        this.started = false;
        this.emit('stop');  
      });
    });
  }
}
