import fs from 'node:fs';

export const getContent = async (type: 'helper' | 'hook') => {
  const files = await fs.promises.readdir(`../../packages/core/src/${type}s`, {
    withFileTypes: true
  });

  return files
    .filter((file) => file.isDirectory())
    .map((file) => ({
      type,
      name: file.name
    }));
};
