export const setCookie = (key, value, options = {}) => {
  const cookie = [`${encodeURIComponent(key)}=${encodeURIComponent(value)}`];
  if (options.path) cookie.push(`path=${options.path}`);
  if (options.domain) cookie.push(`domain=${options.domain}`);
  if (typeof options.maxAge === 'number') cookie.push(`max-age=${options.maxAge}`);
  if (options.expires) cookie.push(`expires=${options.expires.toUTCString()}`);
  if (options.secure) cookie.push(`secure`);
  if (options.httpOnly) cookie.push(`httpOnly`);
  if (options.sameSite) cookie.push(`samesite=${options.sameSite}`);
  document.cookie = cookie.join('; ');
};
