import fs from 'node:fs';

export const getHookFile = async (name: string) => {
  try {
    const filePath = `./src/hooks/${name}/${name}.ts`;

    const stats = await fs.promises.stat(filePath);
    const content = await fs.promises.readFile(filePath, 'utf-8');

    return { stats, content };
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    throw error;
  }
};
