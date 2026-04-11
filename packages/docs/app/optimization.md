# Optimization

## Library philosophy

ReactUse provides **simple, predictable utility hooks**. We do not add shared caches or cross-component optimizations by default. Optimization is a **conscious, application-level decision**, not something the library imposes on every user.

## Why the library stays simple

> "Premature optimization is the root of all evil" — Donald Knuth

The same principle applies here as with [memoization](/memoization): optimization should be applied when there is a real need, not by default.

- **Simple hooks are easier to reason about and debug** — one subscription per hook instance, no hidden shared state.
- **Not every app needs one-listener-per-query** — pushing shared stores into the library would add complexity for everyone, including those who do not need it.
- **Users who need shared or subscription optimizations** can implement or wrap hooks in their application, or use helpers when appropriate.

## Hooks that can be optimized

The library ships a straightforward `useMediaQuery`: each component that uses it gets its own `matchMedia` subscription and change listener. No shared cache.

**Current implementation:**

```ts
import { useCallback, useSyncExternalStore } from 'react';

const getServerSnapshot = () => false;

export const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (callback: () => void) => {
      const matchMedia = window.matchMedia(query);

      // Each hook call gets its own listener
      matchMedia.addEventListener('change', callback);
      return () => {
        matchMedia.removeEventListener('change', callback);
      };
    },
    [query]
  );

  const getSnapshot = () => window.matchMedia(query).matches;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
```

If you measure and find that many components use the same query and you want a single listener per query, you can do that **in your application**. A module-level cache of external stores, one `MediaQueryList` and one `change` listener per unique query.

**Optimized variant:**

```ts
import { useSyncExternalStore } from 'react';

const getServerSnapshot = () => false;

interface MediaQueryListExternalStore {
  getSnapshot: () => boolean;
  subscribe: (onStoreChange: () => void) => () => void;
}

const mediaQueryListExternalStore = new Map<string, MediaQueryListExternalStore>();

const createMediaQueryExternalStore = (query: string): MediaQueryListExternalStore => {
  const mediaQueryList = window.matchMedia(query);
  const listeners = new Set<() => void>();
  const onChange = () => listeners.forEach((listener) => listener());

  const store: MediaQueryListExternalStore = {
    subscribe: (onStoreChange) => {
      listeners.add(onStoreChange);
      if (listeners.size === 1) mediaQueryList.addEventListener('change', onChange);
      return () => {
        listeners.delete(onStoreChange);
        if (listeners.size === 0) {
          mediaQueryList.removeEventListener('change', onChange);
        }
      };
    },
    getSnapshot: () => mediaQueryList.matches
  };
  mediaQueryListExternalStore.set(query, store);
  return store;
};

const getMediaQueryExternalStore = (query: string) =>
  mediaQueryListExternalStore.get(query) ?? createMediaQueryExternalStore(query);

export const useMediaQuery = (query: string) => {
  const store = getMediaQueryExternalStore(query);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, getServerSnapshot);
};
```

The library keeps the simple version by design; the optimized version is something you can adopt in your codebase if it fits your needs.

## createSharedHook

ReactUse also provides [**createSharedHook**](/functions/hooks/createSharedHook.html): a helper that creates one shared instance of a hook globally. The first subscriber's arguments are used; when the number of subscribers drops to zero, the internal runner unmounts.

```tsx
import { createSharedHook, useMediaQuery } from '@siberiacancode/reactuse';

const useSharedMediaQuery = createSharedHook(useMediaQuery);

const First = () => {
  const matches = useSharedMediaQuery('(max-width: 768px)');
  return (
    <div>
      This is <code>{matches ? 'mobile' : 'desktop'}</code> screen
    </div>
  );
};

const Second = () => {
  const matches = useSharedMediaQuery('(max-width: 768px)');
  return (
    <div>
      This is <code>{matches ? 'mobile' : 'desktop'}</code> screen
    </div>
  );
};

const Demo = () => (
  <div>
    <First />
    <Second />
  </div>
);
```

**Important:** **createSharedHook is experimental.** It mounts an internal component in memory and has limitations: hook order is fixed, and the first subscriber's arguments are used for everyone. For production shared state, we recommend:

- **External stores + useSyncExternalStore** — e.g. the optimized useMediaQuery pattern above, or your own store keyed by query or other arguments.
- **Dedicated state libraries** — such as Zustand, Reatom, Effector, or similar — especially for complex shared state, as noted in the `createSharedHook` source.
