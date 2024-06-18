import { useRenderCount } from '../useRenderCount/useRenderCount';

import { useField } from './useField';

const Demo = () => {
  const renderCount = useRenderCount();
  const messageInput = useField({ initialValue: 'Default message' });
  const sexInput = useField({ initialValue: 'Male' });
  const rememberThisComputerInput = useField();

  return (
    <>
      <p>
        Render count: <code>{renderCount}</code>
      </p>

      <pre>
        {JSON.stringify(
          {
            messageInput: {
              dirty: messageInput.dirty,
              touched: messageInput.touched,
              error: messageInput.error
            },
            sexInput: {
              dirty: sexInput.dirty,
              touched: sexInput.touched,
              error: sexInput.error
            },
            rememberThisComputerInput: {
              dirty: rememberThisComputerInput.dirty,
              touched: rememberThisComputerInput.touched,
              error: rememberThisComputerInput.error
            }
          },
          null,
          2
        )}
      </pre>

      <div>
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
      </div>

      <select {...sexInput.register()}>
        <option value='Male'>Male</option>
        <option value='Female'>Female</option>
      </select>

      <label htmlFor='checkbox'>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input id='checkbox' type='checkbox' {...rememberThisComputerInput.register()} />
          <span>Remember this computer?</span>
        </div>
      </label>

      <div>
        <button type='button' onClick={messageInput.reset}>
          Reset
        </button>

        <button type='button' onClick={messageInput.focus}>
          Focus
        </button>

        <button
          type='button'
          onClick={() =>
            alert(
              JSON.stringify(
                {
                  message: messageInput.getValue(),
                  rememberThisComputer: rememberThisComputerInput.getValue(),
                  sex: sexInput.getValue()
                },
                null,
                2
              )
            )
          }
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default Demo;
