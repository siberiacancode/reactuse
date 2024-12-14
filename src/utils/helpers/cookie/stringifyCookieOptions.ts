export interface UseCookieOptions {
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  path?: string;
  priority?: 'low' | 'medium' | 'high';
  sameSite?: boolean | 'lax' | 'strict' | 'none';
  domain?: string;
}

export const stringifyCookieOptions = (options: UseCookieOptions) => {
  return Object.keys(options).reduce((acc, key) => {
    if (key === 'days') {
      return acc;
    }
    if (options[key] === false) {
      return acc;
    }
    if (options[key] === true) {
      return `${acc}; ${key}`;
    }
    return `${acc}; ${key}=${options[key]}`;
  }, '');
};
