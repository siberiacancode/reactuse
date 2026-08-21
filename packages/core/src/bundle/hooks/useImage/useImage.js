import { useEffect, useState } from 'react';
/**
 * @name useImage
 * @description - Hook that load an image in the browser
 * @category Elements
 * @usage low
 *
 * @browserapi Image https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image
 *
 * @param {string} src The source of the image
 * @param {string} [options.srcset] The srcset of the image
 * @param {string} [options.sizes] The sizes of the image
 * @param {string} [options.alt] The alt of the image
 * @param {string} [options.class] The class of the image
 * @param {HTMLImageElement['loading']} [options.loading] The loading of the image
 * @param {string} [options.crossorigin] The crossorigin of the image
 * @param {HTMLImageElement['referrerPolicy']} [options.referrerPolicy] The referrerPolicy of the image
 * @returns {UseImageReturn} An object with the image loading state
 *
 * @example
 * const { value, isLoading, isError, isSuccess, error } = useImage('https://example.com/image.png');
 */
export const useImage = (src, options = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(undefined);
  const [value, setValue] = useState(undefined);
  const { alt, class: className, crossorigin, loading, referrerPolicy, sizes, srcset } = options;
  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);
    setError(undefined);
    setValue(undefined);
    const image = new Image();
    if (alt) image.alt = alt;
    if (srcset) image.srcset = srcset;
    if (sizes) image.sizes = sizes;
    if (className) image.className = className;
    if (loading) image.loading = loading;
    if (crossorigin) image.crossOrigin = crossorigin;
    if (referrerPolicy) image.referrerPolicy = referrerPolicy;
    const onLoad = () => {
      setValue(image);
      setIsSuccess(true);
      setIsLoading(false);
      setError(undefined);
      setIsError(false);
    };
    const onError = (event) => {
      setValue(undefined);
      setIsSuccess(false);
      setIsLoading(false);
      setError(event);
      setIsError(true);
    };
    image.addEventListener('load', onLoad);
    image.addEventListener('error', onError);
    image.src = src;
    if (image.complete) {
      if (image.naturalWidth > 0) onLoad();
      else onError(new Event('error'));
    }
    return () => {
      image.removeEventListener('load', onLoad);
      image.removeEventListener('error', onError);
    };
  }, [alt, className, crossorigin, loading, referrerPolicy, sizes, src, srcset]);
  return {
    value,
    error,
    isLoading,
    isError,
    isSuccess
  };
};
