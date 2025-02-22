import { useEffect, useRef, useState } from 'react';
const DEFAULT_OPTIONS = {
    multiple: true,
    accept: '*',
    reset: false
};
/**
 * @name useFileDialog
 * @description - Hook to handle file input
 * @category Browser
 *
 * @overload
 * @param {(value: FileList | null) => void} callback The callback to execute when a file is selected
 * @param {boolean} [options.multiple=true] Whether multiple files can be selected
 * @param {string} [options.accept='*'] The accepted file types
 * @param {boolean} [options.reset=false] Whether the input should be reset when the callback is called
 * @param {string} [options.capture] The capture value
 * @returns {UseFileDialogReturn} An object containing the selected files
 *
 * @example
 * const { values, open, reset } = useFileDialog((value) => console.log(value));
 *
 * @overload
 * @param {boolean} [options.multiple=true] Whether multiple files can be selected
 * @param {string} [options.accept='*'] The accepted file types
 * @param {boolean} [options.reset=false] Whether the input should be reset when the callback is called
 * @param {string} [options.capture] The capture value
 * @returns {UseFileDialogReturn} An object containing the selected files
 *
 * @example
 * const { values, open, reset } = useFileDialog({ accept: 'image/*' });
 */
export const useFileDialog = ((...params) => {
    const callback = (typeof params[0] === 'function' ? params[0] : undefined);
    const options = (callback ? params[0] : params[1]);
    const [value, setValue] = useState(null);
    const inputRef = useRef();
    const internalCallbackRef = useRef(callback);
    internalCallbackRef.current = callback;
    const reset = () => {
        setValue(null);
        internalCallbackRef.current?.(null);
        if (inputRef.current)
            inputRef.current.value = '';
    };
    const open = (openParams) => {
        if (!inputRef.current)
            return;
        inputRef.current.multiple =
            openParams?.multiple ?? options?.multiple ?? DEFAULT_OPTIONS.multiple;
        inputRef.current.accept = openParams?.accept ?? options?.accept ?? DEFAULT_OPTIONS.accept;
        const capture = openParams?.capture ?? options?.capture;
        if (capture)
            inputRef.current.capture = capture;
        if (openParams?.reset ?? options?.reset ?? DEFAULT_OPTIONS.reset)
            reset();
        inputRef.current.click();
    };
    useEffect(() => {
        const init = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = (event) => {
                const { files } = event.target;
                setValue(files);
                internalCallbackRef.current?.(files);
            };
            return input;
        };
        inputRef.current = init();
        return () => {
            inputRef.current?.remove();
        };
    }, [options?.multiple, options?.accept, options?.capture, options?.reset]);
    return { value, open, reset };
});
