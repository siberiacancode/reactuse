import { useEffect, useState } from 'react';

/** The browser location state type */
export interface BrowserLocationState {
  /** URL hash including # */
  hash?: string;
  /** URL host */
  host?: string;
  /** URL hostname */
  hostname?: string;
  /** Full URL */
  href?: string;
  /** Number of entries in the session history */
  length?: number;
  /** URL origin */
  origin?: string;
  /** URL pathname */
  pathname?: string;
  /** URL port */
  port?: string;
  /** URL protocol */
  protocol?: string;
  /** URL search string */
  search?: string;
  /** URL search parameters */
  searchParams: URLSearchParams;
  /** Browser history state */
  state?: unknown;
}

/** The use browser location return type */
export interface UseBrowserLocationReturn {
  /** Current browser location state */
  value: BrowserLocationState;
  /** Go back in history */
  back: () => void;
  /** Go forward in history */
  forward: () => void;
  /** Move by history delta */
  go: (delta: number) => void;
  /** Navigate to a new URL and push a history entry */
  push: (url: string | URL, state?: unknown, title?: string) => void;
  /** Navigate to a new URL and replace current history entry */
  replace: (url: string | URL, state?: unknown, title?: string) => void;
}

export const getLocationState = (): BrowserLocationState => ({
  searchParams: new URLSearchParams(window.location.search),
  state: window.history.state,
  length: window.history.length,
  hash: window.location.hash,
  host: window.location.host,
  hostname: window.location.hostname,
  href: window.location.href,
  origin: window.location.origin,
  pathname: window.location.pathname,
  port: window.location.port,
  protocol: window.location.protocol,
  search: window.location.search
});

/**
 * @name useBrowserLocation
 * @description - Hook that returns reactive browser location state with navigation controls
 * @category Browser
 * @usage medium
 *
 * @browserapi window.location https://developer.mozilla.org/en-US/docs/Web/API/Window/location
 * @browserapi window.history https://developer.mozilla.org/en-US/docs/Web/API/Window/history
 *
 * @returns {UseBrowserLocationReturn} The current browser location state and navigation methods
 *
 * @example
 * const { value, push, back, forward, go } = useBrowserLocation();
 */
export const useBrowserLocation = (): UseBrowserLocationReturn => {
  const [value, setValue] = useState<BrowserLocationState>(() => {
    if (typeof window === 'undefined')
      return {
        searchParams: new URLSearchParams()
      };
    return getLocationState();
  });

  useEffect(() => {
    const onLocationChange = () => {
      setValue(getLocationState());
    };

    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('hashchange', onLocationChange);

    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('hashchange', onLocationChange);
    };
  }, []);

  const push = (url: string | URL, state?: unknown, title: string = '') => {
    window.history.pushState(state, title, url);
    setValue(getLocationState());
  };

  const replace = (url: string | URL, state?: unknown, title: string = '') => {
    window.history.replaceState(state, title, url);
    setValue(getLocationState());
  };

  const back = () => {
    window.history.back();
  };

  const forward = () => {
    window.history.forward();
  };

  const go = (delta: number) => {
    window.history.go(delta);
  };

  return {
    value,
    push,
    replace,
    back,
    forward,
    go
  };
};
