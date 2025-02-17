export const isTarget = (target: any) =>
  typeof target === 'string' ||
  (typeof window !== 'undefined' &&
    (target instanceof Element || target instanceof Window || target instanceof Document)) ||
  (target && 'current' in target);
