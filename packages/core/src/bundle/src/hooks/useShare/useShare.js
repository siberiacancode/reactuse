/**
 * @name useShare
 * @description - Hook that utilizes the share api
 * @category Browser
 * @usage medium
 *
 * @browserapi share https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
 *
 * @param {UseShareParams} [params] The use share options
 * @returns {UseShareReturn}
 *
 * @example
 * const { share, supported } = useShare();
 */
export const useShare = (params) => {
  const supported = typeof navigator !== 'undefined' && 'share' in navigator && !!navigator.share;
  const trigger = async (shareParams) => {
    if (!supported) return;
    const data = {
      ...params,
      ...shareParams
    };
    if (data.files && navigator.canShare({ files: data.files })) navigator.share(data);
    return navigator.share(data);
  };
  return { trigger, supported };
};
