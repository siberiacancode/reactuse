import { useQRCode } from './useQRCode';

const URL = 'https://siberiacancode.github.io/reactuse/';
const Demo = () => {
  const qrCode = useQRCode(URL);

  return (
    <>
      <p>Text content for QRCode</p>
      <input type='text' defaultValue={URL} onChange={(event) => qrCode.set(event.target.value)} />
      <img src={qrCode.value} alt='QR Code' />
    </>
  );
};

export default Demo;
