import { useRenderCount } from '../useRenderCount/useRenderCount';

import { useInput } from './useInput';

const Demo = () => {
  const renderCount = useRenderCount();
  const messageInput = useInput({ initialValue: 'Default message' });

  return (
    <>
      <p>
        Render count: <code>{renderCount}</code>
      </p>

      <p>
        <pre>
          {JSON.stringify(
            {
              dirty: messageInput.dirty,
              touched: messageInput.touched,
              error: messageInput.error
            },
            null,
            2
          )}
        </pre>
      </p>

      <input
        type='text'
        {...messageInput.register({
          required: 'field is required',
          minLength: {
            value: 2,
            message: 'min length is 2'
          }
        })}
      />
      {messageInput.error && <span style={{ color: 'red' }}>{messageInput.error}</span>}

      <div>
        <button type='button' onClick={messageInput.reset}>
          Reset
        </button>

        <button type='button' onClick={messageInput.focus}>
          Focus
        </button>
      </div>
    </>
  );
};

export default Demo;
