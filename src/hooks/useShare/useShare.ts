import { isClient } from '@/utils/helpers';

/** The use share options type */
export interface UseShareParams {
  /** The title of the share */
  title?: string;
  /** The files of the share */
  files?: File[];
  /** The text of the share */
  text?: string;
  /** The url of the share */
  url?: string;
}

/** The use share return type */
export interface UseShareReturn {
  /** The share function */
  share: (shareParams: ShareData) => Promise<void>;
  /** The share supported status */
  supported: boolean;
}

/**
 * @name useShare
 * @description Custom hook to utilize the Web Share API with fallback and callback options.
 *
 * @param {UseShareParams} [params] The use share options
 * @returns {UseShareReturn}
 *
 * @example
 * const { share, supported } = useShare();
 */

export const useShare = (params?: UseShareParams) => {
  const supported = isClient ? 'share' in navigator : false;

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
