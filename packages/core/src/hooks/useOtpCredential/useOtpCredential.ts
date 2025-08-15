import { useRef, useState } from 'react';

declare global {
  interface OTPOptions {
    readonly transport: string[];
  }

  interface CredentialRequestOptions {
    readonly otp: OTPOptions;
  }

  interface Credential {
    readonly code: string;
  }
}

/* The use otp credential callback type */
export type UseOtpCredentialCallback = (otp: Credential | null) => void;

/* The use otp credential options type */
export interface UseOtpCredentialParams {
  /* The callback function to be invoked on error */
  onError: (error: any) => void;
  /* The callback function to be invoked on success */
  onSuccess: (credential: Credential | null) => void;
}

/* The use otp credential return type */
export interface UseOtpCredentialReturn {
  /* The abort function */
  abort: AbortController['abort'];
  /*  The aborted state of the query */
  aborted: boolean;
  /* The supported state of the otp credential */
  supported: boolean;
  /* The get otp credential function */
  get: () => Promise<Credential | null>;
}

export interface UseOtpCredential {
  (callback?: UseOtpCredentialCallback): UseOtpCredentialReturn;

  (params?: UseOtpCredentialParams): UseOtpCredentialReturn;
}

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
export const useOtpCredential = ((...params: any[]) => {
  const supported =
    typeof navigator !== 'undefined' && 'OTPCredential' in navigator && !!navigator.OTPCredential;

  const onSuccess =
    typeof params[0] === 'function'
      ? (params[0] as UseOtpCredentialCallback | undefined)
      : (params[0] as UseOtpCredentialParams | undefined)?.onSuccess;

  const onError =
    typeof params[0] === 'function'
      ? (params[0] as UseOtpCredentialParams | undefined)?.onError
      : undefined;

  const [aborted, setAborted] = useState(false);

  const abortControllerRef = useRef<AbortController>(new AbortController());

  const get = async () => {
    if (!supported) return;

    abortControllerRef.current = new AbortController();
    try {
      const credential = await navigator.credentials.get({
        otp: { transport: ['sms'] },
        signal: abortControllerRef.current.signal
      });
      onSuccess?.(credential);
      setAborted(false);
      return credential;
    } catch (error) {
      onError?.(error);
    }
  };

  const abort = () => {
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    abortControllerRef.current.signal.onabort = () => setAborted(true);
  };

  return { supported, abort, aborted, get };
}) as UseOtpCredential;
