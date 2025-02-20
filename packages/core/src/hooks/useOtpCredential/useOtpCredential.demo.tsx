import { useOtpCredential } from './useOtpCredential';

const Demo = () => {
  const otpCredential = useOtpCredential();

  const getOtpCode = async () => {
    const credential = await otpCredential.get();
    console.log('credential', credential);
  };

  return (
    <button type='button' onClick={getOtpCode}>
      Get otp
    </button>
  );
};

export default Demo;
