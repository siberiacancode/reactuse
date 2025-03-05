import { useField } from '../useField/useField';
import { useClipboard } from './useClipboard';

const Demo = () => {
  const clipboard = useClipboard();
  const textField = useField();

  return (
    <>
      <p>
        Copied value: <code>{clipboard.value || 'Nothing is copied yet!'}</code>
      </p>
      <input {...textField.register()} />

      <button type='button' onClick={() => clipboard.copy(textField.getValue())}>
        Copy
      </button>
    </>
  );
};

export default Demo;
