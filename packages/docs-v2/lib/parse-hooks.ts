import { parse } from 'comment-parser';
import fs from 'node:fs';
import path from 'node:path';

export const getContent = async (type: 'helper' | 'hook') => {
  const files = await fs.promises.readdir(`../../packages/core/src/${type}s`, {
    withFileTypes: true
  });

  return files
    .filter((file) => file.isDirectory())
    .map((file) => {
      return {
        type,
        name: file.name
      };
    });
};

export const getContentFile = async (type: 'helper' | 'hook', name: string) => {
  try {
    const basePath = `../../packages/core/src/${type}s/${name}/${name}`;
    const dirPath = path.dirname(basePath);

    const files = await fs.promises.readdir(dirPath);

    const fileName = files.find(
      (file) => file.includes(name) && !file.includes('.test') && !file.includes('.demo')
    );

    if (!fileName) {
      throw new Error(`No matching file found for ${name}`);
    }

    const filePath = path.join(dirPath, fileName);
    const content = await fs.promises.readFile(filePath, 'utf-8');

    return content;
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    throw error;
  }
};

export const matchJsdoc = (file: string) => {
  const jsdocCommentRegex = /\/\*\*\s*\n([^\\*]|(\*(?!\/)))*\*\//;
  const match = file.match(jsdocCommentRegex);
  return match ? match[0].trim() : undefined;
};

export const parseHookJsdoc = (file: string) => {
  const jsdoc = parse(file)[0];
  const description = jsdoc.tags.find(({ tag }) => tag === 'description');
  const examples = jsdoc.tags.filter(({ tag }) => tag === 'example');
  const usage = jsdoc.tags.find(({ tag }) => tag === 'usage');
  const deprecated = jsdoc.tags.find(({ tag }) => tag === 'deprecated');
  const category = jsdoc.tags.find(({ tag }) => tag === 'category');
  const warning = jsdoc.tags.find(({ tag }) => tag === 'warning');
  const browserapi = jsdoc.tags.find(({ tag }) => tag === 'browserapi');
  const apiParameters = jsdoc.tags.filter(
    ({ tag }) => tag === 'param' || tag === 'overload' || tag === 'returns'
  );

  return {
    description,
    examples,
    usage,
    apiParameters,
    deprecated,
    category,
    browserapi,
    warning
  };
};
