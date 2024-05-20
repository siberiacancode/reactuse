import { readdirSync } from 'node:fs';

export const getHooks = () => {
  const files = readdirSync('./src/hooks', { withFileTypes: true });
  return files.filter((file) => file.isDirectory()).map((file) => file.name);
};
