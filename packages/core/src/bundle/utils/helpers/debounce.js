export function debounce(callback, delay) {
  let timer;
  const cancel = () => clearTimeout(timer);
  const debounced = function (...args) {
    cancel();
    timer = setTimeout(() => callback.apply(this, args), delay);
  };
  debounced.cancel = cancel;
  return debounced;
}
