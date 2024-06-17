import React from 'react';
import QRCode from 'qrcode';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';

/**
 * @name useQRCode
 * @description - Hook that generates a QR code
 *
 * @param {string} text The text to be encoded in the QR code
 * @param {QRCode.QRCodeToDataURLOptions} [options] The options of the QR code
 * @returns {UseQrCodeReturn} An object with the QR code value and a setter
 *
 * @example
 * const { value, set } = useQRCode('url');
 */
export const useQRCode = (text?: string, options?: QRCode.QRCodeToDataURLOptions) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [value, setValue] = React.useState<string | undefined>();

  const generateQrCode = async (value: string) => {
    setIsLoading(true);
    const qrCode = await QRCode.toDataURL(value, options);
    setValue(qrCode);
  };

  useIsomorphicLayoutEffect(() => {
    if (text) generateQrCode(text);
  }, []);

  const set = (value: string) => generateQrCode(value);

  return { value, set, isLoading };
};
