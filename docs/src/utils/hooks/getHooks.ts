import fs from 'node:fs';

export const getHooks = async () => {
  const files = await fs.promises.readdir('./src/hooks', { withFileTypes: true });
  return files.filter((file) => file.isDirectory()).map((file) => file.name);
};
