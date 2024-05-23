export const debounce = <Params extends unknown[]>(
  callback: (...args: Params) => void,
  delay: number
): ((...args: Params) => void) => {
  let timer: ReturnType<typeof setTimeout>;

  return function (...args: Params) {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
};
