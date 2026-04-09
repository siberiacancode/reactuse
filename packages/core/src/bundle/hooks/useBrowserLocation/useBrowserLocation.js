import { useEffect, useState } from 'react';
export const getLocationState = () => ({
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
export const useBrowserLocation = () => {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return {};
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
  const push = (url, state, title = '') => {
    window.history.pushState(state, title, url);
    setValue(getLocationState());
  };
  const replace = (url, state, title = '') => {
    window.history.replaceState(state, title, url);
    setValue(getLocationState());
  };
  const back = () => {
    window.history.back();
  };
  const forward = () => {
    window.history.forward();
  };
  const go = (delta) => {
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
