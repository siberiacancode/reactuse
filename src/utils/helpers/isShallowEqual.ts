export const isShallowEqual = <Obj extends Record<string, unknown>>(object1: Obj, object2: Obj) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
};
