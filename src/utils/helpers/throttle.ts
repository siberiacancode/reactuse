export const throttle = <Params extends any[]>(
  callback: (...args: Params) => void,
  delay: number
): ((...args: Params) => void) => {
  let isCalled = false;
  let lastArgs: Params | null = null;

  const timer = () => {
    if (!lastArgs) {
      isCalled = false;
      return;
    }

    callback.apply(this, lastArgs);
    lastArgs = null;
    setTimeout(timer, delay);
  };

  return function (this: any, ...args: Params) {
    if (isCalled) {
      lastArgs = args;
      return;
    }

    callback.apply(this, args);
    isCalled = true;
    setTimeout(timer, delay);
  };
};
