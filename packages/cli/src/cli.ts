// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { add } from './commands/add';
import { init } from './commands/init';

export const cli = () => {
  const processArgv = hideBin(process.argv);

  yargs(processArgv)
    .scriptName('@siberiacancode/reactuse-cli')
    .usage('$0 <cmd> [args]')
    .command(init)
    .command(add)
    .epilogue('More info: https://github.com/siberiacancode/reactuse/tree/main')
    .version()
    .alias('v', 'version')
    .help()
    .alias('h', 'help')
    .parse();
};
