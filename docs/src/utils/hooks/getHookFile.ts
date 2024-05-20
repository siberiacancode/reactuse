import { readFileSync } from 'node:fs';

export const getHookFile = (name: string) => {
  try {
    const fileContent = readFileSync(`./src/hooks/${name}/${name}.ts`, 'utf-8');
    return fileContent;
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    throw error;
  }
};
