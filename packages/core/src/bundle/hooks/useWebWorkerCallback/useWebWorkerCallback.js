import { useEffect, useRef, useState } from 'react';
const createSource = (callback) => `
const callback = (${callback});

self.addEventListener('message', (event) => {
  Promise.resolve(callback(...event.data))
    .then((result) => {
      self.postMessage(['SUCCESS', result]);
    })
    .catch((error) => {
      self.postMessage(['ERROR', error]);
    });
});
`;
/**
 * @name useWebWorkerCallback
 * @description - Hook that runs a callback in a web worker without a separate worker file
 * @category Browser
 * @usage low
 *
 * @browserapi Worker https://developer.mozilla.org/en-US/docs/Web/API/Worker
 *
 * @template Callback The callback type
 * @param {Callback} callback The self-contained callback to run in a web worker. Closures are not available, so its arguments and result must be structured-cloneable
 * @returns {UseWebWorkerCallbackReturn<Callback>} An object with the run function and controls
 *
 * @example
 * const { run, pending, terminate } = useWebWorkerCallback(() => {});
 */
export const useWebWorkerCallback = (callback) => {
  const [pending, setPending] = useState(false);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const workerRef = useRef(undefined);
  const urlRef = useRef(undefined);
  const cleanup = () => {
    workerRef.current?.terminate();
    workerRef.current = undefined;
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = undefined;
    }
  };
  const terminate = () => {
    cleanup();
    setPending(false);
  };
  const run = (...args) =>
    new Promise((resolve, reject) => {
      if (workerRef.current) {
        reject(new Error('The web worker callback is already running'));
        return;
      }
      const blob = new Blob([createSource(callbackRef.current.toString())], {
        type: 'text/javascript'
      });
      const url = URL.createObjectURL(blob);
      const worker = new Worker(url);
      workerRef.current = worker;
      urlRef.current = url;
      setPending(true);
      const settle = () => {
        if (workerRef.current !== worker) return false;
        cleanup();
        setPending(false);
        return true;
      };
      worker.addEventListener('message', (event) => {
        if (!settle()) return;
        const [status, result] = event.data;
        if (status === 'SUCCESS') {
          resolve(result);
          return;
        }
        reject(result);
      });
      worker.addEventListener('error', (event) => {
        event.preventDefault();
        if (!settle()) return;
        reject(event);
      });
      worker.postMessage(args);
    });
  useEffect(() => cleanup, []);
  return {
    pending,
    run,
    terminate
  };
};
