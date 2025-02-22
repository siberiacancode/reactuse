import { useRef, useState } from 'react';
/**
 * @name useOtpCredential
 * @description - Hook that creates an otp credential
 * @category Browser
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
export const useOtpCredential = ((...params) => {
    const onSuccess = params[0] instanceof Function
        ? params[0]
        : params[0]?.onSuccess;
    const onError = params[0] instanceof Function
        ? params[0]?.onError
        : undefined;
    const supported = typeof navigator !== 'undefined' && 'OTPCredential' in window;
    const [aborted, setAborted] = useState(false);
    const abortControllerRef = useRef(new AbortController());
    const get = async () => {
        if (!supported)
            return;
        abortControllerRef.current = new AbortController();
        try {
            const credential = await navigator.credentials.get({
                otp: { transport: ['sms'] },
                signal: abortControllerRef.current.signal
            });
            onSuccess?.(credential);
            setAborted(false);
            return credential;
        }
        catch (error) {
            onError?.(error);
        }
    };
    const abort = () => {
        abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        abortControllerRef.current.signal.onabort = () => setAborted(true);
    };
    return { supported, abort, aborted, get };
});
