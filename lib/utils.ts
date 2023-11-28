import * as fs from 'fs';
import * as path from 'path';
import * as async from 'async';
import { execFile } from 'child_process';
import { Stream } from 'stream';

interface ExecOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;  
}

class LineBuffer extends Stream {

  constructor(stream: NodeJS.ReadableStream) {
    super();
    
    // implementation
  }

  write(chunk: string | Buffer): void {
    // implementation
  }

  end(): void {
    // implementation
  }

}

export async function mkdirp(dirname: string, callback: (err: NodeJS.ErrnoException) => void) {
  // implementation
}

export async function getUserEnv(callback: (err: NodeJS.ErrnoException, env: NodeJS.ProcessEnv) => void, defaultEncoding = 'UTF-8') {
  // implementation
}

function exec(command: string[], options: ExecOptions, callback: (err: Error, stdout: string, stderr: string) => void) {
  // implementation  
}

function quote(str: string): string {
  // implementation
}

function makeTemporaryFilename(): string {
  // implementation
}

async function getUserLocale(): Promise<string> {
  // implementation  
}

function parseEnv(stdout: string): NodeJS.ProcessEnv {
  // implementation 
}

export {
  LineBuffer,
  exec,
  quote,
  makeTemporaryFilename,  
  getUserLocale,
  parseEnv
};
