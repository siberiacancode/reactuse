export const isTarget = (target: any) =>
  typeof target === 'string' ||
  target instanceof Element ||
  target instanceof Window ||
  target instanceof Document ||
  (target && 'current' in target);
