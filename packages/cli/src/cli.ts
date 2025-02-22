import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { add } from './commands/add';
import { init } from './commands/init';

export const cli = () => {
  const processArgv = hideBin(process.argv);

  yargs(processArgv)
    .scriptName('reactuse')
    .usage('$0 <cmd> [args]')
    .command(init)
    .command(add)
    .epilogue('More info: https://siberiacancode.github.io/reactuse/')
    .version()
    .alias('v', 'version')
    .help()
    .alias('h', 'help')
    .parse();
};
