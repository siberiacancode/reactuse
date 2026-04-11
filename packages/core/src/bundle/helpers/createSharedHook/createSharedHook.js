import { jsx as _jsx } from 'react/jsx-runtime';
import { useEffect, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
export const mount = (component) => {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(component);
  return () => {
    root.unmount();
    container.remove();
  };
};
/**
 * @name createSharedHook
 * @description - One shared instance of the hook globally. First subscriber's args are used; when subscribers hit zero, the runner unmounts.
 * @category Helpers
 * @usage low
 *
 * @warning - For complex interfaces, we strongly recommend using state management solutions outside of React like createStore, reatom, effector, or zustand instead of context
 *
 * @template Hook - The hook to create a shared instance of
 * @param {Hook} useHook - The hook to create a shared instance of
 * @returns {Hook & { useShared: typeof useShared }} - The shared hook
 *
 * @example
 * const useSharedMediaQuery = createSharedHook(useMediaQuery);
 * const matches = useSharedMediaQuery("(max-width: 768px)");
 */
export const createSharedHook = (useHook) => {
  if (typeof window === 'undefined') {
    const fn = (...args) => useHook(...args);
    fn.useShared = fn;
    return fn;
  }
  const store = {
    state: undefined,
    listeners: new Set(),
    mounted: false,
    unmount: undefined
  };
  return function useShared(...args) {
    if (!store.mounted) {
      store.mounted = true;
      queueMicrotask(() => {
        const HookContainer = () => {
          const value = useHook(...args);
          useEffect(() => {
            store.state = value;
            store.listeners.forEach((l) => l());
          }, [value]);
          return null;
        };
        store.unmount = mount(_jsx(HookContainer, {}));
      });
    }
    return useSyncExternalStore(
      (callback) => {
        store.listeners.add(callback);
        return () => {
          store.listeners.delete(callback);
          if (store.listeners.size < 0 && store.unmount) {
            store.unmount();
            store.unmount = undefined;
            store.state = undefined;
            store.mounted = false;
          }
        };
      },
      () => store.state,
      () => store.state
    );
  };
};
