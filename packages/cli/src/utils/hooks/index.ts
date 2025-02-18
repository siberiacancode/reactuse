import type { Ora } from 'ora';

import { existsSync, writeFileSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

import type { RegistryList } from '@/utils/types';

import { FETCH_REPO_URL } from '@/utils/constants';
import { logger } from '@/utils/logger';

const updateImports = async (filePath: string, aliasesUtilsPathToReplace: string) => {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const utilsImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"](@\/utils[^'"]*)['"]/g;

  const updatedContent = fileContent.replace(utilsImportRegex, (match, imports, path) => {
    const newPath = path.replace(/\/helpers$/, '');
    return `import {${imports}} from '${aliasesUtilsPathToReplace}${newPath.slice(7)}'`;
  });

  await fs.writeFile(filePath, updatedContent);
};

const downloadHook = async (hookName: string, path: string, aliasesUtilsPathToReplace: string) => {
  const hookUrl = `${FETCH_REPO_URL}/hooks/${hookName}/${hookName}.ts`;
  const hookDirName = `${path}/${hookName}`;
  const pathToLoadHooks = `${hookDirName}/${hookName}.ts`;

  if (!existsSync(hookDirName)) {
    await fs.mkdir(hookDirName, { recursive: true });
  }

  try {
    const response = await fetch(hookUrl);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(pathToLoadHooks, buffer);
    await updateImports(pathToLoadHooks, aliasesUtilsPathToReplace);
  } catch (error) {
    logger.error(`\n Error downloading ${hookName} hook. Try again. Error - ${error}`);
    process.exit(1);
  }
};

const updateUtilIndexFile = async (utilName: string, utilsPath: string) => {
  const indexPath = path.join(utilsPath, 'index.ts');
  const indexExist = existsSync(indexPath);
  const exportStatement = `export * from './${utilName}';\n`;

  if (!indexExist) {
    writeFileSync(indexPath, '');
  }
  const indexFileContent = await fs.readFile(indexPath, 'utf-8');

  if (!indexFileContent.includes(exportStatement)) {
    await fs.appendFile(indexPath, exportStatement, 'utf-8');
  }
};

const downloadUtil = async (utilName: string, path: string) => {
  let utilUrl = `${FETCH_REPO_URL}/utils/helpers/${utilName}.ts`;
  const utilPath = `${path}/${utilName}.ts`;

  if (!existsSync(path)) {
    await fs.mkdir(path, { recursive: true });
  }

  try {
    if (utilName === 'getDate') utilUrl = `${FETCH_REPO_URL}/utils/helpers/time/${utilName}.ts`;
    const response = await fetch(utilUrl);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(utilPath, buffer);
    updateUtilIndexFile(utilName, path);
  } catch (error) {
    logger.error(`\n Error downloading ${utilName} util. Try again. Error - ${error}`);
    process.exit(1);
  }
};

const resolveHookDependencies = (
  registryIndex: RegistryList[],
  deps: string[],
  collectedDeps: Set<string> = new Set()
): Set<string> => {
  for (const dependency of deps) {
    if (collectedDeps.has(dependency)) {
      continue;
    }

    const entry = registryIndex.find((entry) => entry.name === dependency);
    if (!entry) {
      continue;
    }

    collectedDeps.add(entry.name);

    if (entry.hookDependency?.length) {
      resolveHookDependencies(registryIndex, entry.hookDependency, collectedDeps);
    }
  }

  return collectedDeps;
};

const resolveUtilDependencies = (registryIndex: RegistryList[], hooks: string[]): Set<string> => {
  const collectedUtils = new Set<string>();

  for (const hook of hooks) {
    const entry = registryIndex.find((entry) => entry.name === hook);
    if (!entry || !entry.utilsDependency?.length) {
      continue;
    }

    for (const util of entry.utilsDependency) {
      collectedUtils.add(util);
    }
  }

  return collectedUtils;
};

export const downloadHooks = async (
  hook: string,
  registryIndex: RegistryList[],
  pathToLoadHooks: string,
  pathToLoadUtils: string,
  spinner: Ora,
  aliasesUtilsPath: string
) => {
  spinner.text = `Installing ${hook}...`;
  const findedHook = registryIndex.find((registryHook) => registryHook.name === hook);

  if (!findedHook) {
    spinner.fail(`Hook ${hook} not found`);
    return null;
  }

  const hookDependencies = Array.from(
    resolveHookDependencies(registryIndex, findedHook.hookDependency)
  );

  const utilDependencies = Array.from(
    resolveUtilDependencies(registryIndex, [...hookDependencies, findedHook.name])
  );

  for (const hook of Array.from(hookDependencies)) {
    spinner.text = `Installing hook ${hook} as Dependecy`;
    await downloadHook(hook, pathToLoadHooks, aliasesUtilsPath);
  }

  for (const util of Array.from(utilDependencies)) {
    spinner.text = `Installing util ${util} as Dependecy`;
    await downloadUtil(util, pathToLoadUtils);
  }

  spinner.text = `Installing hook ${hook}`;
  await downloadHook(hook, pathToLoadHooks, aliasesUtilsPath);
};
