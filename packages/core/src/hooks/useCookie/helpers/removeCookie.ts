export interface RemoveCookieParams {
  domain?: string;
  expires?: Date;
  maxAge?: number;
  path?: string;
  sameSite?: 'Lax' | 'None' | 'Strict';
  secure?: boolean;
}

export const removeCookie = (key: string, options: RemoveCookieParams = {}) => {
  document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${
    options.path ? `; path=${options.path}` : ''
  }${options.domain ? `; domain=${options.domain}` : ''}${options.maxAge ? `; max-age=0` : ''}${
    options.expires ? `; expires=Thu, 01 Jan 1970 00:00:00 GMT` : ''
  }${options.secure ? `; secure` : ''}${options.sameSite ? `; samesite=${options.sameSite}` : ''}`;
};
