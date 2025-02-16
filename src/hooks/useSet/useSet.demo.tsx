import { useField } from '../useField/useField';
import { useSet } from './useSet';

const Demo = () => {
  const scopeInput = useField({ initialValue: '' });
  const scopes = useSet(['@siberiacancode', '@siberiacancode-tests', '@shared']);

  return (
    <>
      <div className='flex gap-2'>
        <input {...scopeInput.register()} placeholder='Enter scope' />

        <button
          type='button'
          onClick={() => {
            scopes.add(scopeInput.getValue().trim().toLowerCase());
            scopeInput.reset();
          }}
        >
          Add
        </button>
      </div>

      <div className='mt-4 flex gap-2'>
        {Array.from(scopes.value).map((scope, index) => (
          <div key={index} className='cursor-pointer' onClick={() => scopes.remove(scope)}>
            <code>{scope}</code>
          </div>
        ))}
      </div>
    </>
  );
};

export default Demo;
