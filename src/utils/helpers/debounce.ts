export function debounce<Params extends unknown[]>(
  callback: (...args: Params) => void,
  delay: number
): (...args: Params) => void {
  let timer: ReturnType<typeof setTimeout>;

  return function (this: any, ...args: Params) {
    clearTimeout(timer);
    timer = setTimeout(() => callback.apply(this, args), delay);
  };
}
