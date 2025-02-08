import { useRenderCount } from '../useRenderCount/useRenderCount';
import { useField } from './useField';

const Demo = () => {
  const renderCount = useRenderCount();
  const nameInput = useField({ initialValue: 'Dmtitry', validateOnChange: true });
  const sexSelect = useField({ initialValue: 'Male' });
  const aboutTextArea = useField();
  const rememberThisComputerCheckbox = useField();

  return (
    <>
      <p>
        Render count: <code>{renderCount}</code>
      </p>

      <pre>
        {JSON.stringify(
          {
            messageInput: {
              dirty: nameInput.dirty,
              touched: nameInput.touched,
              error: nameInput.error
            },
            sexSelect: {
              dirty: sexSelect.dirty,
              touched: sexSelect.touched,
              error: sexSelect.error
            },
            aboutTextArea: {
              dirty: aboutTextArea.dirty,
              touched: aboutTextArea.touched,
              error: aboutTextArea.error
            },
            rememberThisComputerInput: {
              dirty: rememberThisComputerCheckbox.dirty,
              touched: rememberThisComputerCheckbox.touched,
              error: rememberThisComputerCheckbox.error
            }
          },
          null,
          2
        )}
      </pre>

      <div>
        <input
          placeholder='Name'
          type='text'
          {...nameInput.register({
            required: 'field is required',
            minLength: {
              value: 2,
              message: 'min length is 2'
            }
          })}
        />
        {nameInput.error && <span style={{ color: 'red' }}>{nameInput.error}</span>}
      </div>

      <select {...sexSelect.register()}>
        <option value='Male'>Male</option>
        <option value='Female'>Female</option>
      </select>

      <textarea placeholder='About' rows={5} {...aboutTextArea.register()} />

      <label htmlFor='checkbox'>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input id='checkbox' type='checkbox' {...rememberThisComputerCheckbox.register()} />
          <span>Remember this computer?</span>
        </div>
      </label>

      <div>
        <button type='button' onClick={nameInput.reset}>
          Reset
        </button>

        <button type='button' onClick={nameInput.focus}>
          Focus
        </button>

        <button
          type='button'
          onClick={() =>
            alert(
              JSON.stringify(
                {
                  message: nameInput.getValue(),
                  sex: sexSelect.getValue(),
                  about: aboutTextArea.getValue(),
                  rememberThisComputer: rememberThisComputerCheckbox.getValue()
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
