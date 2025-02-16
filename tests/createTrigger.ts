export function createTrigger<Callback extends (...args: any[]) => void, Key>() {
  const observers = new Map();
  return {
    callback(key: Key, ...args: Partial<Parameters<Callback>>) {
      const observe = observers.get(key);
      observe(...args);
    },
    add(key: Key, callback: Callback) {
      observers.set(key, callback);
    },
    delete(key: Key) {
      observers.delete(key);
    }
  };
}
