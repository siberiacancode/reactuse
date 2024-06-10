import { isClient } from './isClient';

export const getCookie = (name: string, initialValue: string = '') => {
  return (
    (isClient &&
      document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
      }, '')) ||
    initialValue
  );
};
