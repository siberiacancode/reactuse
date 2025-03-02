import { parse } from 'comment-parser';

export const parseHookJsdoc = (file: string) => {
  const jsdoc = parse(file)[0];
  const description = jsdoc.tags.find(({ tag }) => tag === 'description');
  const usages = jsdoc.tags.filter(({ tag }) => tag === 'example');
  const deprecated = jsdoc.tags.find(({ tag }) => tag === 'deprecated');
  const category = jsdoc.tags.find(({ tag }) => tag === 'category');
  const browserapi = jsdoc.tags.find(({ tag }) => tag === 'browserapi');
  const apiParameters = jsdoc.tags.filter(
    ({ tag }) => tag === 'param' || tag === 'overload' || tag === 'returns'
  );

  return { description, usages, apiParameters, deprecated, category, browserapi };
};
