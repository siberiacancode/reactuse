import { useRef } from 'react';
/**
 * @name useOtpCredential
 * @description - Hook that creates an otp credential
 * @category Browser
 * @usage low
 *
 * @browserapi navigator.credentials https://developer.mozilla.org/en-US/docs/Web/API/Navigator/credentials
 *
 * @overload
 * @param {UseOtpCredentialCallback} callback The callback function to be invoked
 * @returns {UseOtpCredentialReturn}
 *
 * @example
 * useOtpCredential((credential) => console.log(credential));
 *
 * @overload
 * @param {UseOtpCredentialCallback} params.onSuccess The callback function to be invoked on success
 * @param {UseOtpCredentialCallback} params.onError The callback function to be invoked on error
 * @returns {UseOtpCredentialReturn}
 *
 * @example
 * useOtpCredential({ onSuccess: (credential) => console.log(credential), onError: (error) => console.log(error) });
 */
export const useOtpCredential = (...params) => {
  const supported =
    typeof navigator !== 'undefined' && 'OTPCredential' in navigator && !!navigator.OTPCredential;
  const options =
    typeof params[0] === 'object'
      ? params[0]
      : {
          onSuccess: params[0]
        };
  const abortControllerRef = useRef(new AbortController());
  const get = async () => {
    if (!supported) return;
    abortControllerRef.current = new AbortController();
    try {
      const credential = await navigator.credentials.get({
        otp: { transport: ['sms'] },
        signal: abortControllerRef.current.signal
      });
      options.onSuccess?.(credential);
      return credential;
    } catch (error) {
      options.onError?.(error);
    }
  };
  const abort = () => {
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
  };
  return { supported, abort, get };
};
