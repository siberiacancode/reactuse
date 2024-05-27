import { useCopyToClipboard } from './useCopyToClipboard';

const Demo = () => {
  const clipboard = useCopyToClipboard();

  const handleCopy = (value: string) => () => {
    clipboard
      .copy(value)
      .then(() => {
        console.log('Copied!', { value });
      })
      .catch((error) => {
        console.error('Failed to copy!', error);
      });
  };

  return (
    <>
      <p>Click to copy:</p>
      <div style={{ display: 'flex' }}>
        <button type='button' onClick={handleCopy('A')}>
          A
        </button>
        <button type='button' onClick={handleCopy('B')}>
          B
        </button>
        <button type='button' onClick={handleCopy('C')}>
          C
        </button>
      </div>
      <p>Copied value: {clipboard.value ?? 'Nothing is copied yet!'}</p>
      <input type='text' placeholder='Paste here' />
    </>
  );
};

export default Demo;
