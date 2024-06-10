import React from 'react';

import { getCookie, removeCookie as removeItem, setCookie as setItem } from '@/utils/helpers';

export interface UseCookieOptions {
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  path?: string;
  priority?: 'low' | 'medium' | 'high';
  sameSite?: boolean | 'lax' | 'strict' | 'none';
  domain?: string;
}

export interface UseCookieReturn {
  value?: string;
  updateCookie: (value: string, options?: UseCookieOptions) => void;
  removeCookie: () => void;
}

export const useCookie = (key: string, initialValue?: string): UseCookieReturn => {
  const [value, setValue] = React.useState<string | undefined>(() => {
    return getCookie(key, initialValue);
  });

  const removeCookie = React.useCallback(() => {
    setValue(undefined);
    removeItem(key);
  }, [key]);

  const updateCookie = (value: string, options?: UseCookieOptions) => {
    setValue(value);
    setItem(key, value, options);
  };

  return { value, updateCookie, removeCookie } as const;
};
