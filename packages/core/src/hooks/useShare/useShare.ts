/** The use share options type */
export interface UseShareParams {
  /** The files of the share */
  files?: File[];
  /** The text of the share */
  text?: string;
  /** The title of the share */
  title?: string;
  /** The url of the share */
  url?: string;
}

/** The use share return type */
export interface UseShareReturn {
  /** The share supported status */
  supported: boolean;
  /** The share function */
  share: (shareParams: ShareData) => Promise<void>;
}

/**
 * @name useShare
 * @description - Hook that utilizes the share api
 * @category Browser
 *
 * @param {UseShareParams} [params] The use share options
 * @returns {UseShareReturn}
 *
 * @example
 * const { share, supported } = useShare();
 */
export const useShare = (params?: UseShareParams) => {
  const supported = typeof navigator !== 'undefined' && 'share' in navigator;

  const share = async (shareParams: ShareData) => {
    if (!supported) return;

    const data = {
      ...params,
      ...shareParams
    };

    if (data.files && navigator.canShare({ files: data.files })) navigator.share(data);

    return navigator.share(data);
  };

  return { share, supported };
};
