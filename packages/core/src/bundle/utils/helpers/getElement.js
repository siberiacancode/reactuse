export const getElement = (target) => {
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
