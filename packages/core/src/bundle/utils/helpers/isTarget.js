export const targetSymbol = Symbol('target');
const getElement = (target) => {
  if ('current' in target) {
    return target.current;
  }
  if (typeof target.value === 'function') {
    return target.value();
  }
  if (typeof target.value === 'string') {
    return document.querySelector(target.value);
  }
  if (target.value instanceof Document) {
    return target.value;
  }
  if (target.value instanceof Window) {
    return target.value;
  }
  if (target.value instanceof Element) {
    return target.value;
  }
  return target.value;
};
export const target = (target) => ({
  value: target,
  type: targetSymbol
});
export const isTarget = (target) =>
  typeof target === 'object' && ('current' in target || (target && target.type === targetSymbol));
isTarget.wrap = target;
isTarget.getElement = getElement;
