import * as fs from 'fs';
import * as path from 'path';
import * as async from 'async';

import Logger from './logger';
import { mkdirp } from './util'; 
import { sourceScriptEnv, getUserEnv } from './util';

interface HostConfiguration {
  root?: string;
  url?: string; 
}

interface ConfigurationOptions {
  bin: string;
  dstPort: number;
  httpPort: number;
  dnsPort: number;  
  timeout: number;
  workers: number;
  domains: string[];
  extDomains: string[];
  hostRoot: string;
  logRoot: string;
  rvmPath: string; 
}

class Configuration {

  static userConfigurationPath = path.join(process.env.HOME, '.powconfig');

  env: NodeJS.ProcessEnv;
  loggers: { [name: string]: Logger }; 

  bin: string;
  dstPort: number;
  // ... other options

  constructor(env = process.env) {
    this.env = env;
    this.loggers = {};
    this.initialize(env);
  }

  async initialize(env: NodeJS.ProcessEnv) {
    // implementation
  }

  getLogger(name: string) {
    // implementation 
  }

  findHostConfiguration(host: string, callback: (err: Error, domain: string, config: HostConfiguration) => void) {
    // implementation
  }

}

function getFilenamesForHost(host: string, domain: string | RegExp): string[] {
  // implementation
}

function compilePattern(domains: string[]): RegExp {
  // implementation
}

export = Configuration;
