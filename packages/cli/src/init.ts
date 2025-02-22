import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import prompts from 'prompts';

import { APP_PATH } from '@/utils/constants';

export const init = async () => {
    try {
        console.log('\nInitializing config file...\n');
        const response = await prompts([
            {
                type: 'toggle',
                name: 'typescript',
                message: `Would you like to use ${chalk.cyan('TypeScript')} (recommended)?`,
                initial: true,
                active: 'yes',
                inactive: 'no'
            },
            {
                type: 'text',
                name: 'hookPath',
                message: 'Configure the import alias for hooks',
                initial: '@/shared/hooks'
            },
            {
                type: 'text',
                name: 'utilsPath',
                message: 'Configure the import alias for utils',
                initial: '@/utils/helpers'
            }
        ],
            {
                onCancel: () => {
                    throw new Error('❌ Operation cancelled');
                }
            });

        const configPath = path.join(APP_PATH, 'reactuse.config.json');

        await fs.writeFileSync(configPath, JSON.stringify(response, null, 2), 'utf8');
        console.log(chalk.bold('\n🎉 Config file initialized. Thanks for using reactuse! 🎉'));
    } catch (cancelled: any) {
        console.log(cancelled?.message);
        process.exit(1);
    }
};