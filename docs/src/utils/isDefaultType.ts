export const DEFAULT_TYPES = [
  'string',
  'number',
  'bigint',
  'boolean',
  'symbol',
  'undefined',
  'object',
  'function',
  'null',
  'array',
  'map',
  'set',
  'weakset',
  'weakmap',
  'error',
  'date'
];

export const isDefaultType = (type: string) => DEFAULT_TYPES.includes(type);
