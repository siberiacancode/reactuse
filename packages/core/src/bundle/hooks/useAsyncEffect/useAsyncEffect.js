import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
/**
 * @name useAsyncEffect
 * @description – Hook that triggers the effect callback on updates
 * @category Lifecycle
 * @usage medium

 * @param {EffectCallback} effect The effect callback
 * @param {DependencyList} [deps] The dependencies list for the effect
 *
 * @example
 * useAsyncEffect(async () => console.log("effect runs on updates"), deps);
 */
export const useAsyncEffect = (сallback, deps) => {
  useIsomorphicLayoutEffect(() => {
    сallback();
  }, deps);
};
