export function createTrigger<Key, Callback extends (...args: any[]) => void>() {
  const observers = new Map();
  return {
    callback(key: Key, ...args: Partial<Parameters<Callback>>) {
      const observe = observers.get(key);
      if (!observe) return;
      observe(...args);
    },
    add(key: Key, callback: Callback) {
      observers.set(key, callback);
    },
    delete(key: Key) {
      observers.delete(key);
    },
    get(key: Key) {
      return observers.get(key);
    }
  };
}
