type DebouncedCallback<Params extends unknown[]> = ((...args: Params) => void) & {
  cancel: () => void;
};

export const debounce = <Params extends unknown[]>(
  callback: (...args: Params) => void,
  delay: number
): DebouncedCallback<Params> => {
  let timer: ReturnType<typeof setTimeout>;

  const cancel = () => clearTimeout(timer);

  const debounced = function (this: any, ...args: Params) {
    cancel();
    timer = setTimeout(() => callback.apply(this, args), delay);
  };

  debounced.cancel = cancel;

  return debounced;
};
