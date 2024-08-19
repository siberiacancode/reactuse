import * as fs from 'fs/promises';

const REGEX = {
  utils: /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]@\/utils[^'"]*['"]/g,
  dependencyHooks: /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"][^'"]*\/use\w*\/[^'"]*['"]/g
};
export const findImports = async (filePath: string, regex: keyof typeof REGEX) => {
  const code = await fs.readFile(filePath, 'utf-8');
  const regularExpression = REGEX[regex];

  let match;
  const imports: string[] = [];

  // eslint-disable-next-line no-cond-assign
  while ((match = regularExpression.exec(code)) !== null) {
    const importedItems = match[1].split(',').map((item) => item.trim());
    imports.push(...importedItems);
  }

  return imports;
};
