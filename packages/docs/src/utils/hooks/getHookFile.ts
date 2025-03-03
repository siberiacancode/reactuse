import fs from 'node:fs';

export const getHookFile = async (name: string) => {
  try {
    const filePath = `../../packages/core/src/hooks/${name}/${name}.ts`;
    const content = await fs.promises.readFile(filePath, 'utf-8');

    return content;
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    throw error;
  }
};
