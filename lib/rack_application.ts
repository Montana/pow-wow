import * as async from "async";
import * as fs from "fs";
import * as nack from "nack";
import * as path from "path";

const { bufferLines, pause, sourceScriptEnv } = require("./util");

export class RackApplication {
  configuration: any;
  root: string;
  firstHost: any;
  logger: any;
  readyCallbacks: (() => void)[];
  quitCallbacks: (() => void)[];
  statCallbacks: (() => void)[];
  state: string | null;
  pool: any;
  mtime: number | null;

  constructor(configuration: any, root: string, firstHost: any) {
    this.configuration = configuration;
    this.root = root;
    this.firstHost = firstHost;
    this.logger = this.configuration.getLogger(
      path.join("apps", path.basename(this.root))
    );
    this.readyCallbacks = [];
    this.quitCallbacks = [];
    this.statCallbacks = [];
  }

  ready(callback: () => void) {
    if (this.state === "ready") {
      callback();
    } else {
      this.readyCallbacks.push(callback);
      this.initialize();
    }
  }

  quit(callback?: () => void) {
    if (this.state) {
      if (callback) {
        this.quitCallbacks.push(callback);
      }
      this.terminate();
    } else if (callback) {
      callback();
    }
  }

  queryRestartFile(callback: (restart: boolean) => void) {
    fs.stat(path.join(this.root, "tmp/restart.txt"), (err, stats) => {
      let lastMtime;

      if (err) {
        this.mtime = null;
        callback(false);
      } else {
        lastMtime = this.mtime;
        this.mtime = stats.mtime.getTime();
        callback(lastMtime !== this.mtime);
      }
    });
  }

  setPoolRunOnceFlag(callback: () => void) {
    if (!this.statCallbacks.length) {
      fs.exists(path.join(this.root, "tmp/always_restart.txt"), (alwaysRestart) => {
        for (let statCallback of this.statCallbacks) {
          statCallback();
        }
        this.statCallbacks = [];
      });
    }
    this.statCallbacks.push(callback);
  }

  loadScriptEnvironment(env: any, callback: (err: any, env: any) => void) {
    async.reduce(
      [".powrc", ".envrc", ".powenv"],
      env,
      (env, filename, callback) => {
        const script = path.join(this.root, filename);
        fs.exists(script, (scriptExists) => {
          if (scriptExists) {
            sourceScriptEnv(script, env, callback);
          } else {
            callback(null, env);
          }
        });
      },
      callback
    );
  }

  loadRvmEnvironment(env: any, callback: (err: any, env: any) => void) {
    const script = path.join(this.root, ".rvmrc");
    fs.exists(script, (rvmrcExists) => {
      if (rvmrcExists) {
        // Load RVM
      } else {
        callback(null, env);
      }
    });
  }

  loadEnvironment(callback: (err: any, env: any) => void) {
    this.queryRestartFile(() => {
      this.loadScriptEnvironment(this.configuration.env, (err, env) => {
        if (err) {
          callback(err);
        } else {
          this.loadRvmEnvironment(env, callback);
        }
      });
    });
  }

  initialize() {
    // ...
  }

  terminate() {
    // ...
  }

  handle(req: any, res: any, next: any, callback?: () => void) {
    this.ready((err) => {
      if (err) {
        next(err);
      } else {
        // ...
      }
    });
  }

  restart(callback: () => void) {
    this.quit(() => {
      this.ready(callback);
    });
  }

  restartIfNecessary(callback: () => void) {
    this.queryRestartFile((mtimeChanged) => {
      if (mtimeChanged) {
        this.restart(callback);
      } else {
        callback();
      }
    });
  }

  static rvmBoilerplate = `
    if [ -f "$rvm_path/scripts/rvm" ] && [ -f ".rvmrc" ]; then
      source "$rvm_path/scripts/rvm"
      source ".rvmrc"
    fi
  `;
}
