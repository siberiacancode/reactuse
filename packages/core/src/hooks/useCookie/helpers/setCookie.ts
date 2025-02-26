export interface SetCookieParams {
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: 'Lax' | 'None' | 'Strict';
  secure?: boolean;
}

export const setCookie = (key: string, value: string, options: SetCookieParams = {}) => {
  const cookie: string[] = [`${encodeURIComponent(key)}=${encodeURIComponent(value)}`];

  if (options.path) cookie.push(`path=${options.path}`);
  if (options.domain) cookie.push(`domain=${options.domain}`);
  if (typeof options.maxAge === 'number') cookie.push(`max-age=${options.maxAge}`);
  if (options.expires) cookie.push(`expires=${options.expires.toUTCString()}`);
  if (options.secure) cookie.push(`secure`);
  if (options.httpOnly) cookie.push(`httpOnly`);
  if (options.sameSite) cookie.push(`samesite=${options.sameSite}`);

  document.cookie = cookie.join('; ');
};
