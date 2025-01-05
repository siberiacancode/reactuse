import { useField } from '../useField/useField';
import { usePermission } from '../usePermission/usePermission';
import { useClipboard } from './useClipboard';

const Demo = () => {
  const clipboard = useClipboard();
  const textField = useField();
  const clipboardReadPermission = usePermission('clipboard-read');
  const clipboardWritePermissionWrite = usePermission('clipboard-write');

  return (
    <>
      <p>
        Clipboard Permission: read <b>{clipboardReadPermission.state}</b> | write{' '}
        <b>{clipboardWritePermissionWrite.state}</b>
      </p>

      <p>
        Copied value: <code>{clipboard.value || 'Nothing is copied yet!'}</code>
      </p>
      <input {...textField.register()} />

      <div style={{ display: 'flex' }}>
        <button type='button' onClick={() => clipboard.copy(textField.getValue())}>
          Copy
        </button>
      </div>
    </>
  );
};

export default Demo;
