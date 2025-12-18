import type { Argv } from 'yargs';

import fetches from '@siberiacancode/fetches';
import chalk from 'chalk';
import { execa } from 'execa';
import fs from 'node:fs';
import path from 'node:path';
import ora from 'ora';
import prompts from 'prompts';
import { createMatchPath, loadConfig } from 'tsconfig-paths';

import type { AddOptionsSchema, ConfigSchema, Registry } from '@/utils/types';

import { APP_PATH, REPO_URLS } from '@/utils/constants';
import { getConfig, getPackageManager, toCase } from '@/utils/helpers';
import { addOptionsSchema } from '@/utils/types';

type FileType = 'hook' | 'package' | 'util';
interface FileItem {
  name: string;
  parent: string;
  type: FileType;
}

const resolveDependencies = (registry: Registry, hooks: string[]): Map<string, FileItem> => {
  const files = new Map<string, FileItem>();

  const addFile = (name: string, type: FileType, parent: string) =>
    !files.has(name) && files.set(name, { type, name, parent });

  const resolveDependency = (hook: string): void => {
    if (files.has(hook)) return;

    const item = registry[hook]!;

    addFile(hook, 'hook', item.name);

    item.utils.forEach((util) => addFile(util, 'util', item.name));
    item.packages.forEach((pkg) => addFile(pkg, 'package', item.name));
    item.hooks.forEach(resolveDependency);
  };

  hooks.forEach(resolveDependency);

  return files;
};

interface UpdateImportsRules {
  regex: RegExp;
  replacer: (...args: string[]) => string;
}

const updateImports = async (filePath: string, config: ConfigSchema) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const rules: UpdateImportsRules[] = [
    {
      regex: /import\s+\{([^}]+)\}\s+from\s+['"](@\/utils[^'"]*)['"]/g,
      replacer: (_, imports) => `import {${imports}} from '${config.aliases.utils}'`
    },
    {
      regex: /import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+['"](\.[^'"]*)['"]/g,
      replacer: (_, imports, internalPath) =>
        `import {${imports}} from '${toCase(internalPath, config.case)}'`
    }
  ];

  const updatedContent = rules.reduce(
    (acc, { regex, replacer }) => acc.replace(regex, replacer),
    fileContent
  );

  fs.writeFileSync(filePath, updatedContent);
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
      .option('cwd', {
        type: 'string',
        description: 'the working directory. defaults to the current directory.',
        default: APP_PATH
      })
      .option('overwrite', {
        alias: 'o',
        type: 'boolean',
        default: false,
        description: 'overwrite existing files'
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
      registry: argv.registry,
      overwrite: argv.overwrite,
      cwd: argv.cwd
    });

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

    const config = await getConfig(options.cwd);
    const language = config?.ts ? 'ts' : 'js';

    const projectConfig = loadConfig(options.cwd);
    if (projectConfig.resultType === 'failed') {
      throw new Error(
        `Failed to load ${language}config.json. ${projectConfig.message ?? ''}`.trim()
      );
    }

    const matchPath = createMatchPath(projectConfig.absoluteBaseUrl, projectConfig.paths);
    const pathToLoadHooks = matchPath(config.aliases.hooks, undefined, () => true);
    const pathToLoadUtils = matchPath(config.aliases.utils, undefined, () => true);

    if (!pathToLoadHooks || !pathToLoadUtils) {
      console.log('Failed to load paths.');
      process.exit(1);
    }

    const dependencies = resolveDependencies(registry, selectedHooks);
    const packages: string[] = [];
    const files = Array.from(dependencies.values())
      .map((dependency) => {
        if (dependency.type === 'hook') {
          const filePath = toCase(`${dependency.name}/${dependency.name}`, config.case);
          const directoryPath = `${pathToLoadHooks}/${filePath}.${language}`;
          const registryPath = `${
            REPO_URLS[language.toUpperCase() as keyof typeof REPO_URLS]
          }/hooks/${dependency.name}/${dependency.name}.${language}`;
          const indexPath = `${pathToLoadHooks}/index.${language}`;
          return {
            name: dependency.name,
            directoryPath,
            registryPath,
            type: dependency.type,
            indexPath,
            filePath
          };
        }

        if (dependency.type === 'util') {
          const filePath = toCase(`${dependency.name}`, config.case);
          const directoryPath = `${pathToLoadUtils}/${filePath}.${language}`;
          const registryPath = `${
            REPO_URLS[language.toUpperCase() as keyof typeof REPO_URLS]
          }/utils/helpers/${dependency.name}.${language}`;
          const indexPath = `${pathToLoadUtils}/index.${language}`;
          return {
            name: dependency.name,
            directoryPath,
            registryPath,
            type: dependency.type,
            indexPath,
            filePath
          };
        }

        if (dependency.type === 'package') {
          packages.push(dependency.name);
          return undefined;
        }

        throw new Error(`Unknown dependency type: ${dependency.type}`);
      })
      .filter(Boolean);

    const spinner = ora('Installing files...').start();
    for (const file of files) {
      const { directoryPath, registryPath, indexPath, filePath, name, type } = file!;
      spinner.text = `Installing ${name}...`;
      const directory = path.dirname(directoryPath);

      const isExists = fs.existsSync(directory);
      if (isExists && !options.overwrite) {
        spinner.stop();
        const { overwrite } = await prompts({
          type: 'confirm',
          name: 'overwrite',
          message: `File ${name} already exists. Would you like to overwrite?`,
          initial: false
        });

        if (!overwrite) {
          console.log(
            `Skipped ${name}. To overwrite, run with the ${chalk.green('--overwrite')} flag.`
          );
          continue;
        }

        spinner.start(`Installing ${name}...`);
      }

      if (!isExists) fs.mkdirSync(directory, { recursive: true });

      const fileResponse = await fetches.get<Buffer>(registryPath);
      await fs.writeFileSync(directoryPath, fileResponse.data);
      await updateImports(directoryPath, config);

      const exportStatement = `export * from './${filePath}';\n`;

      if (!fs.existsSync(indexPath)) fs.writeFileSync(indexPath, '');
      const indexFileContent = fs.readFileSync(indexPath, 'utf-8');
      if (!indexFileContent.includes(exportStatement))
        fs.appendFileSync(indexPath, exportStatement, 'utf-8');
    }

    const packageManager = await getPackageManager(options.cwd);

    spinner.text = `Installing packages ${chalk.bold(
      packages.join(', ')
    )} with ${chalk.cyan(packageManager)}`;
    if (packages.length) {
      await execa(packageManager, [packageManager === 'npm' ? 'install' : 'add', ...packages], {
        cwd: options.cwd
      });
    }

    spinner.stop();

    const installedHooks = files
      .filter((file) => file!.type === 'hook')
      .map((file) => chalk.green(file!.name))
      .join(', ');
    console.log(`\nInstalled hooks: ${installedHooks}`);
    console.log(chalk.bold('\n🎉 Hooks added successfully! 🎉'));
  }
};
