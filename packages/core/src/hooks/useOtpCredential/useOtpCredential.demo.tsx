import { useOtpCredential } from '@siberiacancode/reactuse';

const Demo = () => {
  const otpCredential = useOtpCredential();

  const getOtpCode = async () => {
    const credential = await otpCredential.get();
    console.log('credential', credential);
  };

  if (!otpCredential.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/OTPCredential'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <button type='button' onClick={getOtpCode}>
      Get otp
    </button>
  );
};

export default Demo;
