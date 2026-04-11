import type { ReactNode } from 'react';

import { createContext, useContext } from 'react';

/**
 * @name createContextHook
 * @description - Hook that runs inside a Provider; Provider accepts params (the hook's arguments). Use when you need a scoped instance per subtree.
 * @category Helpers
 * @usage low
 *
 * @warning - For complex interfaces, we strongly recommend using state management solutions outside of React like createStore, reatom, effector, or zustand instead of context
 *
 * @param useHook - The hook to run in the Provider (e.g. useMediaQuery)
 * @returns { Provider, use } — Provider takes params; use() returns the value and must be used inside Provider
 *
 * @example
 * const { Provider, use } = createContextHook(useMediaQuery);
 * <Provider params={["(max-width: 768px)"]}>
 *   <Component />
 * </Provider>
 * const matches = use();
 */
export const createContextHook = <Hook extends (...args: any[]) => any>(useHook: Hook) => {
  type Value = ReturnType<Hook>;
  const Context = createContext<Value | null>(null);

  const Provider = ({ children, params }: { children: ReactNode; params: Parameters<Hook> }) => {
    const value = useHook(...params) as Value;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const use = () => useContext(Context);

  return { Provider, use };
};
