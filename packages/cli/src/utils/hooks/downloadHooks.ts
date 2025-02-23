import type { Ora } from 'ora';

import fs from 'node:fs';
import path from 'node:path';

import type { HookRegistry, PreferLanguage } from '@/utils/types';

import { getUrl } from '@/utils/config/getConfig';
import { logger } from '@/utils/logger';

import { REPO_URLS } from '../constants';

const updateImports = async (filePath: string, aliasesUtilsPathToReplace: string) => {
  const fileContent = await fs.readFileSync(filePath, 'utf-8');
  const utilsImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"](@\/utils[^'"]*)['"]/g;

  const updatedContent = fileContent.replace(utilsImportRegex, (match, imports, path) => {
    const newPath = path.replace(/\/helpers$/, '');
    return `import {${imports}} from '${aliasesUtilsPathToReplace}${newPath.slice(7)}'`;
  });

  fs.writeFileSync(filePath, updatedContent);
};

const downloadHook = async (
  hookName: string,
  path: string,
  aliasesUtilsPathToReplace: string,
  registryIndex: HookRegistry[],
  preferLanguage: PreferLanguage
) => {
  const hookDirName = `${path}/${hookName}`;
  const pathToLoadHooks = `${hookDirName}/${hookName}.${preferLanguage}`;

  if (!fs.existsSync(hookDirName)) {
    fs.mkdirSync(hookDirName, { recursive: true });
  }
  try {
    const response = await fetch(REPO_URLS[preferLanguage.toUpperCase() as keyof typeof REPO_URLS]);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.promises.writeFile(pathToLoadHooks, buffer);
    await updateImports(pathToLoadHooks, aliasesUtilsPathToReplace);
  } catch (error) {
    logger.error(`\n Error downloading ${hookName} hook. Try again. Error - ${error}`);
    process.exit(1);
  }
};

const downloadLocalDependencies = async (
  hookName: string,
  path: string,
  localDependencies: string[],
  preferLanguage: PreferLanguage
) => {
  const localDirName = `${path}/${hookName}/helpers`;

  if (!fs.existsSync(localDirName)) {
    fs.mkdirSync(localDirName, { recursive: true });
  }

  for (const localDependency of localDependencies) {
    const localUrl = `${getUrl(preferLanguage)}/hooks/${hookName}/helpers/${localDependency}.${preferLanguage}`;
    const pathToLoadLocal = `${localDirName}/${localDependency}.${preferLanguage}`;

    try {
      const response = await fetch(localUrl);

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await fs.promises.writeFile(pathToLoadLocal, buffer);
    } catch (error) {
      logger.error(`\n Error downloading ${localDependency} function. Try again. Error - ${error}`);
      process.exit(1);
    }
  }
};

const updateUtilIndexFile = async (
  utilName: string,
  utilsPath: string,
  preferLanguage: PreferLanguage
) => {
  const indexPath = path.join(utilsPath, `index.${preferLanguage}`);
  const indexExist = fs.existsSync(indexPath);
  const exportStatement = `export * from './${utilName}';\n`;

  if (!indexExist) {
    fs.writeFileSync(indexPath, '');
  }
  const indexFileContent = fs.readFileSync(indexPath, 'utf-8');

  if (!indexFileContent.includes(exportStatement)) {
    fs.appendFileSync(indexPath, exportStatement, 'utf-8');
  }
};

const downloadUtil = async (utilName: string, path: string, preferLanguage: PreferLanguage) => {
  let utilUrl = `${getUrl(preferLanguage)}/utils/helpers/${utilName}.${preferLanguage}`;
  const utilPath = `${path}/${utilName}.${preferLanguage}`;

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }

  try {
    if (utilName === 'getDate')
      utilUrl = `${getUrl(preferLanguage)}/utils/helpers/time/${utilName}.${preferLanguage}`;
    const response = await fetch(utilUrl);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.promises.writeFile(utilPath, buffer);
    updateUtilIndexFile(utilName, path, preferLanguage);
  } catch (error) {
    logger.error(`\n Error downloading ${utilName} util. Try again. Error - ${error}`);
    process.exit(1);
  }
};

const resolveHookDependencies = (
  registryIndex: HookRegistry[],
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

const resolveUtilDependencies = (registryIndex: HookRegistry[], hooks: string[]): Set<string> => {
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
  registryIndex: HookRegistry[],
  pathToLoadHooks: string,
  pathToLoadUtils: string,
  spinner: Ora,
  aliasesUtilsPath: string,
  preferLanguage: PreferLanguage
) => {
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
    await downloadHook(hook, pathToLoadHooks, aliasesUtilsPath, registryIndex, preferLanguage);
  }

  for (const util of Array.from(utilDependencies)) {
    spinner.text = `Installing util ${util} as Dependecy`;
    await downloadUtil(util, pathToLoadUtils, preferLanguage);
  }

  spinner.text = `Installing hook ${hook}`;
  await downloadHook(hook, pathToLoadHooks, aliasesUtilsPath, registryIndex, preferLanguage);

  if (findedHook.localDependency.length) {
    spinner.text = `Installing helpers for hook ${hook}`;
    await downloadLocalDependencies(
      hook,
      pathToLoadHooks,
      findedHook.localDependency,
      preferLanguage
    );
  }
};
