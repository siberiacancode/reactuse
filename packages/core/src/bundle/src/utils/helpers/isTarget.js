export const targetSymbol = Symbol('target');
export const target = (target) => ({
  value: target,
  type: targetSymbol
});
export const isRef = (target) => typeof target === 'object' && 'current' in target;
export const isRefState = (target) =>
  typeof target === 'function' && 'state' in target && 'current' in target;
export const isBrowserTarget = (target) =>
  typeof target === 'object' &&
  target &&
  'type' in target &&
  target.type === targetSymbol &&
  'value' in target;
export const isTarget = (target) => isRef(target) || isRefState(target) || isBrowserTarget(target);
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
export const getRefState = (target) => target && 'state' in target && target.state;
export const getRawElement = (target) => {
  if (isRefState(target)) return target.state;
  if (isBrowserTarget(target)) return target.value;
  return target;
};
isTarget.wrap = target;
isTarget.getElement = getElement;
isTarget.getRefState = getRefState;
isTarget.getRawElement = getRawElement;
