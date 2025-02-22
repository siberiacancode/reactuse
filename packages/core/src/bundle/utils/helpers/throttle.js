export const throttle = (callback, delay) => {
  let isCalled = false;
  let lastArgs = null;
  const timer = () => {
    if (!lastArgs) {
      isCalled = false;
      return;
    }
    callback.apply(this, lastArgs);
    lastArgs = null;
    setTimeout(timer, delay);
  };
  return function (...args) {
    if (isCalled) {
      lastArgs = args;
      return;
    }
    callback.apply(this, args);
    isCalled = true;
    setTimeout(timer, delay);
  };
};
