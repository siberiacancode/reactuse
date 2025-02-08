/* eslint-disable no-cond-assign */
/* eslint-disable regexp/no-unused-capturing-group */

export const extractHookDependencies = (content: string): string[] => {
  const hookImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]*use[^'"]*)['"]/g;
  const dependencies = [];

  let match;
  while ((match = hookImportRegex.exec(content)) !== null) {
    const importedItems = match[1]
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.startsWith('use') && /^[a-z]/.test(item));

    dependencies.push(...importedItems);
  }

  return dependencies;
};

export const extractUtilsDependencies = (content: string): string[] => {
  const utilsImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"](@\/utils[^'"]*)['"]/g;
  const dependencies = [];

  let match;
  while ((match = utilsImportRegex.exec(content)) !== null) {
    const importedItems = match[1]
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    dependencies.push(...importedItems);
  }

  return dependencies;
};
