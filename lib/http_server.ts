import * as fs from 'fs';
import * as url from 'url';
import * as connect from 'connect';
import * as request from 'request';
import { dirname, join } from 'path';

import RackApplication from './rack_application';
import { pause } from './util';
import { mkdirp } from './util';

interface Configuration {
  // ...
}

interface Logger {
  // ...
}

class HttpServer extends connect.HTTPServer {

  version: string;
  configuration: Configuration;
  accessLog: Logger;
  staticHandlers: {[key: string]: connect.Handler};
  rackApplications: {[key: string]: RackApplication};  
  requestCount: number;

  constructor(configuration: Configuration) {
    super();
    this.configuration = configuration;
    
    this.accessLog = configuration.getLogger('access');
    this.staticHandlers = {};
    this.rackApplications = {}; 
    this.requestCount = 0;

    // handlers
  }

  logRequest(req: connect.IncomingMessage, res: connect.ServerResponse, next: Function) {
    // imp
  }

  findRackApplication(req: connect.IncomingMessage, res: connect.ServerResponse, next: Function) {
    // imp
  }

  handleProxyRequest(req: connect.IncomingMessage, res: connect.ServerResponse, next: Function) {
    // imp
  }

  toJSON() {
    // imp
  }

}

export = HttpServer;
