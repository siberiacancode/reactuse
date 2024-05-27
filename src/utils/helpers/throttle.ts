export const throttle = <Params extends any[]>(
  callback: (...args: Params) => void,
  delay: number
): ((...args: Params) => void) => {
  let isCalled = false;

  return function (...args) {
    if (!isCalled) {
      callback(...args);
      isCalled = true;
      setTimeout(function () {
        isCalled = false;
      }, delay);
    }
  };
};
