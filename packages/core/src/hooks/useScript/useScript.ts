import type { ComponentProps } from 'react';

import { useEffect, useState } from 'react';

/** The use script status */
export type UseScriptStatus = 'error' | 'loading' | 'ready' | 'unknown';
export const SCRIPT_STATUS_ATTRIBUTE_NAME = 'script-status';

/** The use script options extends from attributes script tag */
export type UseScriptOptions = ComponentProps<'script'>;

/**
 * @name useScript
 * @description - Hook that manages a script with onLoad, onError, and removeOnUnmount functionalities
 * @category Elements
 * @usage low
 *
 * @param {string} src The source of the script
 * @param {UseScriptOptions} [options] The options of the script extends from attributes script tag
 * @param {boolean} [options.async=true] Whether to load the script asynchronously
 * @returns {UseScriptStatus} The status of the script
 *
 * @example
 * const status = useScript('https://example.com/script.js');
 */
export const useScript = (src: string, options: UseScriptOptions = {}) => {
  const [status, setStatus] = useState<UseScriptStatus>(() => {
    if (typeof document === 'undefined') return 'loading';

    const script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
    const scriptStatus = script?.getAttribute(SCRIPT_STATUS_ATTRIBUTE_NAME) as UseScriptStatus;
    if (scriptStatus) return scriptStatus;
    if (script) return 'unknown';

    return 'loading';
  });
  const { async = true } = options;

  useEffect(() => {
    if (typeof document === 'undefined') return;

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

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);

    return () => {
      script.remove();
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
    };
  }, [src]);

  return status;
};
