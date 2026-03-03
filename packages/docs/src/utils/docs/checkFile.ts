import fs from 'node:fs';

export const checkFile = async (element: { type: string; name: string }, type: 'demo' | 'test') => {
  const files = await fs.promises.readdir(`../core/src/${element.type}s/${element.name}`);

  return files.some((file) => file.includes(`${element.name}.${type}`));
};
