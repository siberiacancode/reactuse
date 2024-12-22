export const throttle = <Params extends any[]>(
  callback: (...args: Params) => void,
  delay: number
): ((...args: Params) => void) => {
  let isCalled = false;

  return function (this: any, ...args) {
    if (!isCalled) {
      callback.apply(this, args);
      isCalled = true;
      setTimeout(() => {
        isCalled = false;
      }, delay);
    }
  };
};
