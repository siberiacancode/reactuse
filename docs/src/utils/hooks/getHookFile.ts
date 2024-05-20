import fs from 'node:fs';

export const getHookFile = async (name: string) => {
  try {
    const fileContent = await fs.promises.readFile(`./src/hooks/${name}/${name}.ts`, 'utf-8');
    return fileContent;
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    throw error;
  }
};
