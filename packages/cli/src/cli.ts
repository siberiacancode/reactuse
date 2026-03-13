import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { add } from './add';
import { init } from './init';

export const cli = () => {
  const processArgv = hideBin(process.argv);

  if (processArgv.includes('init')) return init();

  yargs(processArgv)
    .scriptName('reactuse')
    .usage('$0 <cmd> [args]')
    .command(add)
    .epilogue('More info: https://reactuse.org/cli')
    .version()
    .alias('v', 'version')
    .help()
    .alias('h', 'help')
    .parse();
};
