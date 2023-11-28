import { Daemon, Configuration, Installer } from '..';
import * as util from 'util';

process.title = 'pow';

interface Options {
  printConfig: boolean;
  createInstaller: (() => Installer) | null; 
  dryRun: boolean;
}

function usage() {
  // ...
}

Configuration.getUserConfiguration(async (err, configuration) => {

  const options: Options = {
    printConfig: false,
    createInstaller: null,
    dryRun: false
  };
  
  // parse command line options
  
  if (options.printConfig) {
    printConfig(configuration);
  } else if (options.createInstaller) {
    const installer = options.createInstaller(configuration);
    
    if (options.dryRun) {
      printDryRun(installer);
    } else {
      await installer.install();
    }
  } else {
    const daemon = new Daemon(configuration);
    daemon.on('restart', () => process.exit());  
    daemon.start(); 
  }

});

function printConfig(config: Configuration) {
  // implementation  
}

function printDryRun(installer: Installer) {
  // implementation
}
