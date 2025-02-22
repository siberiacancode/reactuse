import { useQuery } from '../useQuery/useQuery';
const loadImage = async (src, options = {}) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const { srcset, sizes, class: className, loading, crossorigin, referrerPolicy } = options;
    img.src = src;
    if (srcset) img.srcset = srcset;
    if (sizes) img.sizes = sizes;
    if (className) img.className = className;
    if (loading) img.loading = loading;
    if (crossorigin) img.crossOrigin = crossorigin;
    if (referrerPolicy) img.referrerPolicy = referrerPolicy;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
/**
 * @name useImage
 * @description - Hook that load an image in the browser
 * @category Browser
 *
 * @param {string} src The source of the image
 * @param {string} [options.srcset] The srcset of the image
 * @param {string} [options.sizes] The sizes of the image
 * @param {string} [options.alt] The alt of the image
 * @param {string} [options.class] The class of the image
 * @param {HTMLImageElement['loading']} [options.loading] The loading of the image
 * @param {string} [options.crossorigin] The crossorigin of the image
 * @param {HTMLImageElement['referrerPolicy']} [options.referrerPolicy] The referrerPolicy of the image
 * @param {DependencyList} [useQueryOptions.keys] The dependencies for the hook
 * @param {(data: Data) => void} [useQueryOptions.onSuccess] The callback function to be invoked on success
 * @param {(error: Error) => void} [useQueryOptions.onError] The callback function to be invoked on error
 * @param {number} [useQueryOptions.refetchInterval] The refetch interval
 * @param {boolean | number} [useQueryOptions.retry] The retry count of requests
 * @returns {UseImageReturn} An object with the state of the image
 *
 * @example
 * const { data, isLoading, isError, isSuccess, error, refetch, isRefetching } = useImage('https://example.com/image.png');
 */
export const useImage = (src, options, useQueryOptions = {}) =>
  useQuery(() => loadImage(src, options), {
    keys: [src, ...(useQueryOptions.keys ?? [])],
    ...useQueryOptions
  });
