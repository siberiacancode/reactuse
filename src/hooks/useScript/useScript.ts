import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';

/** The use script status */
export type UseScriptStatus = 'loading' | 'ready' | 'error' | 'unknown';
export const SCRIPT_STATUS_ATTRIBUTE_NAME = 'script-status';

/** The use script options extends from attributes script tag */
export interface UseScriptOptions extends ComponentProps<'script'> {
  /** Whether to remove the script on unmount */
  removeOnUnmount?: boolean;
}

/**
 * @name useScript
 * @description - Hook that manages a script with onLoad, onError, and removeOnUnmount functionalities
 *
 * @param {string} src The source of the script
 * @param {UseScriptOptions} [options] The options of the script extends from attributes script tag
 * @param {boolean} [options.removeOnUnmount=true] Whether to remove the script on unmount
 * @param {boolean} [options.async=true] Whether to load the script asynchronously
 * @returns {UseScriptStatus} The status of the script
 *
 * @example
 * const status = useScript('https://example.com/script.js');
 */
export const useScript = (src: string, options: UseScriptOptions = {}) => {
  const [status, setStatus] = useState<UseScriptStatus>(() => {
    const script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
    const scriptStatus = script?.getAttribute(SCRIPT_STATUS_ATTRIBUTE_NAME) as UseScriptStatus;
    if (scriptStatus) return scriptStatus;
    if (script) return 'unknown';

    return 'loading';
  });
  const { removeOnUnmount = true, async = true } = options;

  useEffect(() => {
    const existedScript = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
    const scriptStatus = existedScript?.getAttribute(
      SCRIPT_STATUS_ATTRIBUTE_NAME
    ) as UseScriptStatus;
    if (scriptStatus) return setStatus(scriptStatus);
    if (existedScript) return setStatus('unknown');

    const script = document.createElement('script');
    script.src = src;
    script.async = async;

    for (const [key, value] of Object.entries(options)) {
      script.setAttribute(key, String(value));
    }

    script.setAttribute(SCRIPT_STATUS_ATTRIBUTE_NAME, 'loading');
    document.body.appendChild(script);

    const onLoad = () => {
      script.setAttribute(SCRIPT_STATUS_ATTRIBUTE_NAME, 'ready');
      setStatus('ready');
    };

    const onError = () => {
      script.setAttribute(SCRIPT_STATUS_ATTRIBUTE_NAME, 'error');
      setStatus('error');
    };

    const removeEventListeners = () => {
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
    };

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);

    return () => {
      if (removeOnUnmount) {
        script.remove();
        removeEventListeners();
      }
    };
  }, [src, removeOnUnmount]);

  return status;
};
