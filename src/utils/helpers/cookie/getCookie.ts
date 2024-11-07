export const getCookie = (name: string, initialValue: string = '') =>
  document.cookie.split('; ').reduce((acc, current) => {
    return current.split('=')[0] === name ? decodeURIComponent(current.split('=')[1]) : acc;
  }, '') || initialValue;
