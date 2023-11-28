import * as fs from 'fs';
import * as path from 'path';

import Log from 'log';
import { mkdirp } from './util';

interface Logger {
  path: string;
  level: string;
  readyCallbacks: (() => void)[];
  log: Log;
  stream: fs.WriteStream;
  
  ready(callback: () => void): void;
  debug(...args: any[]): void;
  info(...args: any[]): void;
  notice(...args: any[]): void;
  warning(...args: any[]): void;  
  error(...args: any[]): void;
  critical(...args: any[]): void;
  alert(...args: any[]): void;  
  emergency(...args: any[]): void;
}

class Logger implements Logger {

  public static LEVELS = ["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"];
  
  constructor(path: string, level = 'debug') {
    this.path = path;
    this.level = level; 
    this.readyCallbacks = [];
  }

  ready(callback: () => void) {
    // implementation
  }

  debug(...args: any[]) {
    // implementation  
  }

  // other log methods...

}

export = Logger;
