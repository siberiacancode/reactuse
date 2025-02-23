import type { Argv } from 'yargs';

import fetches from '@siberiacancode/fetches';
import chalk from 'chalk';
import fs from 'node:fs';
import ora from 'ora';
import prompts from 'prompts';
import { createMatchPath, loadConfig } from 'tsconfig-paths';

import type { AddOptionsSchema, Registry } from '@/utils/types';

import { getConfig } from '@/utils/config/getConfig';
import { APP_PATH, REPO_URLS } from '@/utils/constants';
import { addOptionsSchema } from '@/utils/types';


const resolveDependencies = (registry: Registry, hook: string) => {
  const hooks = new Set<string>();
  const utils = new Set<string>();

  const resolveDependency = (hook: string) => {
    const item = registry[hook]!;
    hooks.add(hook);
    if (item.utils.length) Array.from(item.utils).forEach((util) => utils.add(util));

    for (const hook of item.hooks) {
      resolveDependency(hook);
    }
  };

  resolveDependency(hook);

  return { hooks: Array.from(hooks), utils: Array.from(utils) };
};

export const add = {
  command: 'add [hooks...]',
  describe: 'Add a hook to your project',
  builder: (yargs: Argv) =>
    yargs
      .positional('hooks', {
        describe: 'List of hooks to add',
        type: 'string',
        demandOption: true,
        array: true,
        default: []
      })
      .option('all', {
        alias: 'a',
        type: 'boolean',
        default: false,
        description: 'add all available hooks'
      })
      .option('registry', {
        type: 'string',
        description: 'url of the registry to use',
        demandOption: true,
        default: 'https://siberiacancode.github.io/reactuse/registry.json'
      }),

  handler: async (argv: AddOptionsSchema) => {
    const options = addOptionsSchema.parse({
      hooks: argv.hooks,
      all: argv.all,
      registry: argv.registry
    });

    const config = await getConfig(APP_PATH);
    if (!config) {
      console.log(
        `Configuration is missing. Please run ${chalk.green(`init`)} to create a reactuse.config.json file.`
      );
      process.exit(1);
    }

    const registryResponse = await fetches.get<Registry>(options.registry);
    const registry = registryResponse.data;

    if (!registry) {
      console.log('Registry is missing. Please check the url.');
      process.exit(1);
    }

    let selectedHooks = options.all ? Object.keys(registry) : options.hooks;
    if (!selectedHooks.length) {
      const { hooks } = await prompts({
        type: 'multiselect',
        name: 'hooks',
        message: `Which ${chalk.cyan('hooks')} would you like to add?`,
        hint: 'Space to select. A to toggle all. Enter to submit.',
        instructions: false,
        choices: Object.values(registry).map((hook) => ({
          title: hook.name,
          value: hook.name,
          selected: false
        }))
      });
      if (hooks) selectedHooks = hooks;
    }

    if (!options.all) {
      for (const hook of selectedHooks) {
        if (!registry[hook]) {
          console.log(`Hook ${hook} not found in the registry.`);
          process.exit(1);
        }
      }
    }

    if (!selectedHooks.length) {
      console.log('No hooks selected.');
      process.exit(0);
    }

    const language = config.typescript ? 'ts' : 'js';

    const projectConfig = loadConfig(APP_PATH);
    if (projectConfig.resultType === 'failed') {
      throw new Error(`Failed to load tsconfig.json. ${projectConfig.message ?? ''}`.trim());
    }

    const matchPath = createMatchPath(projectConfig.absoluteBaseUrl, projectConfig.paths);
    const pathToLoadHooks = matchPath(config.hookPath, undefined, () => true);
    const pathToLoadUtils = matchPath(config.utilsPath, undefined, () => true);

    if (!pathToLoadHooks || !pathToLoadUtils) {
      console.log('Failed to load paths.');
      process.exit(1);
    }

    const spinner = ora('Installing hooks...').start();
    const files = selectedHooks.reduce<{ utils: string[]; hooks: string[] }>(
      (acc, hook) => {
        const item = registry[hook];

        if (!item) {
          spinner.fail(`Hook ${hook} not found in the registry`);
          return acc;
        }

        const dependencies = resolveDependencies(registry, hook);
        acc.utils.push(...dependencies.utils);
        acc.hooks.push(...dependencies.hooks);
        return acc;
      },
      { utils: [], hooks: [] }
    );

    const utils = Array.from(new Set(files.utils));
    const hooks = Array.from(new Set(files.hooks));

    Promise.all([
      ...hooks.map(async (hook) => {
        const directory = `${pathToLoadHooks}/${hook}`;
        const path = `${directory}/${hook}.${language}`;

        if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });

        const hookFileResponse = await fetches.get<Buffer>(
          `${REPO_URLS[language.toUpperCase() as keyof typeof REPO_URLS]}/hooks/${hook}/${hook}.${language}`
        );
        const buffer = Buffer.from(hookFileResponse.data);

        await fs.writeFileSync(path, buffer);
      }),
      ...utils.map(async (util) => {
        const directory = pathToLoadUtils;
        const path = `${directory}/${util}.${language}`;

        if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });

        const utilFileResponse = await fetches.get<Buffer>(
          `${REPO_URLS[language.toUpperCase() as keyof typeof REPO_URLS]}/utils/helpers/${util}.${language}`
        );
        const buffer = Buffer.from(utilFileResponse.data);

        await fs.writeFileSync(path, buffer);

        const indexPath = `${pathToLoadUtils}/index.${language}`;
        const indexExist = fs.existsSync(indexPath);
        const exportStatement = `export * from './${util}';\n`;

        if (!indexExist) fs.writeFileSync(indexPath, '');
        const indexFileContent = fs.readFileSync(indexPath, 'utf-8');
        if (!indexFileContent.includes(exportStatement))
          fs.appendFileSync(indexPath, exportStatement, 'utf-8');
      })
    ]);

    spinner.succeed('Done.');
  }
};
