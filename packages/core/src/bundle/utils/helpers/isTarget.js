export const targetSymbol = Symbol('target');
export const target = (target) => ({
  value: target,
  type: targetSymbol
});
export const isTarget = (target) =>
  typeof target === 'object' && ('current' in target || (target && target.type === targetSymbol));
isTarget.wrap = target;
