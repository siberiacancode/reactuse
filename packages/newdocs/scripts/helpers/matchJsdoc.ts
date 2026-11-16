export const matchJsdoc = (file: string) => {
  const jsdocCommentRegex = /\/\*\*[ \t]*\r?\n[\s\S]*?\*\//;
  const match = file.match(jsdocCommentRegex);
  return match ? match[0].trim() : undefined;
};
