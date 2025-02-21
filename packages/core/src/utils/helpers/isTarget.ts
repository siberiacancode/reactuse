export const isTarget = (target: any) =>
  typeof target === 'string' ||
  target instanceof Element ||
  target instanceof Window ||
  target instanceof Document ||
  (target && typeof target === 'object' && 'current' in target);
