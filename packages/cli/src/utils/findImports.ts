import * as fs from 'fs/promises';

export const findImports = async (filePath: string) => {
  const code = await fs.readFile(filePath, 'utf-8');
  const regex = /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]@\/utils[^'"]*['"]/g;
  let match;
  const imports: string[] = [];

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(code)) !== null) {
    const importedItems = match[1].split(',').map((item) => item.trim());
    imports.push(...importedItems);
  }

  return imports;
};
