export const isTarget = (target) =>
  typeof target === 'string' ||
  target instanceof Element ||
  target instanceof Window ||
  target instanceof Document ||
  (target && typeof target === 'object' && 'current' in target);
