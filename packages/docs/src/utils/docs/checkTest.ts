import fs from 'node:fs';

export const checkTest = async (element: { type: string; name: string }) => {
  const files = await fs.promises.readdir(`../core/src/${element.type}s/${element.name}`);

  return files.some((file) => file.includes(`${element.name}.test`));
};
