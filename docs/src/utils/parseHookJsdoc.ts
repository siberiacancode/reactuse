import { parse } from 'comment-parser';

export const parseHookJsdoc = (file: string) => {
  const jsdoc = parse(file)[0];
  const description = jsdoc.tags.find(({ tag }) => tag === 'description');
  const usage = jsdoc.tags.find(({ tag }) => tag === 'example');
  const deprecated = jsdoc.tags.find(({ tag }) => tag === 'deprecated');
  const apiParameters = jsdoc.tags.filter(
    ({ tag }) => tag === 'param' || tag === 'overload' || tag === 'returns'
  );

  return { description, usage, apiParameters, deprecated };
};
