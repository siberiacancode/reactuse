import React from 'react';

import { isClient } from '@/utils/helpers';

interface ShareParams {
  title?: string;
  text?: string;
  url?: string;
}

interface UseShareParams {
  onShare?: (content: ShareParams) => void;
  onSuccess?: (content: ShareParams) => void;
  onError?: (error: any) => void;
  fallback?: () => void;
  // Time in milliseconds after which the shared state is reset.
  successTimeout?: number;
}

/**
 * @name useShare
 * @description Custom hook to utilize the Web Share API with fallback and callback options.
 *
 * @param {UseShareParams} params - Parameters for configuring the hook.
 * @returns {Object} - Returns an object with share function and states: isSupported, isReady, isShared.
 * @returns {Function} returns.share - Function to trigger sharing.
 * @returns {boolean} returns.isSupported - Indicates if the Web Share API is supported.
 * @returns {boolean} returns.isReady - Indicates if the hook is ready to use.
 * @returns {boolean} returns.isShared - Indicates if the content has been shared.
 *
 * @example
 * const { share, isSupported, isReady, isShared } = useShare();
 */

export const useShare = ({
  onShare,
  onSuccess,
  onError,
  fallback,
  successTimeout = 3000
}: UseShareParams = {}) => {
  const [isSupported, setIsSupported] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [isShared, setIsShared] = React.useState(false);

  React.useEffect(() => {
    if (isClient && 'navigator' in window) {
      setIsSupported('share' in navigator);
      setIsReady(true);
    }
  }, []);

  const resetIsShared = (timeout: number) => {
    const timer = setTimeout(() => setIsShared(false), timeout);
    return () => clearTimeout(timer);
  };

  const share = React.useCallback(
    async (content: ShareParams) => {
      if (isSupported) {
        onShare?.(content);

        try {
          await navigator.share(content);
          setIsShared(true);

          onSuccess?.(content);

          return resetIsShared(successTimeout);
        } catch (error) {
          onError?.(error);
        }
      } else {
        fallback?.();
        setIsShared(true);

        return resetIsShared(successTimeout);
      }
    },
    [fallback, isSupported, onError, onShare, onSuccess, successTimeout]
  );

  return { share, isSupported, isReady, isShared };
};
