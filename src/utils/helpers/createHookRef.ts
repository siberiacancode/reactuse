export interface HookRef<Element> {
  (node: Element): void;
  readonly current: Element | undefined;
}

export const createHookRef = <Element>(
  value: Element | undefined,
  set: (element: Element) => void
) => {
  function ref(node: Element) {
    set(node);
  }

  Object.defineProperty(ref, 'current', {
    get() {
      return value;
    },
    configurable: true,
    enumerable: true
  });

  return ref as HookRef<Element>;
};
