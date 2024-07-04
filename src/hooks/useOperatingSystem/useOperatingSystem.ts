import { useRef } from 'react';

/** The operating system type */
export type OperatingSystem = 'undetermined' | 'macos' | 'ios' | 'windows' | 'android' | 'linux';

export const getOperatingSystem = (): OperatingSystem => {
  if (typeof window === 'undefined') return 'undetermined';

  const { userAgent } = window.navigator;

  if (/(Macintosh)|(MacIntel)|(MacPPC)|(Mac68K)/i.test(userAgent)) return 'macos';
  if (/(iPhone)|(iPad)|(iPod)/i.test(userAgent)) return 'ios';
  if (/(Win32)|(Win64)|(Windows)|(WinCE)/i.test(userAgent)) return 'windows';
  if (/Android/i.test(userAgent)) return 'android';
  if (/Linux/i.test(userAgent)) return 'linux';

  return 'undetermined';
};

/**
 * @name useOperatingSystem
 * @description - Hook that returns the operating system of the current browser
 * @category Browser
 *
 * @returns {OperatingSystem} The operating system
 *
 * @example
 * const operatingSystem = useOperatingSystem();
 */
export const useOperatingSystem = () => {
  const osOperatingSystemRef = useRef<OperatingSystem>(getOperatingSystem());
  return osOperatingSystemRef.current;
};
