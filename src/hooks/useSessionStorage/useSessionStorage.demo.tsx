import { useSessionStorage } from './useSessionStorage';

const Demo = () => {
  const [value, setValue, removeValue] = useSessionStorage('siberiacancode-use-local-storage', 0);

  return (
    <div>
      <p>
        Count: <code>{value ?? 'value is undefined'}</code>
      </p>
      {value !== undefined && (
        <>
          <button type='button' onClick={() => setValue(value + 1)}>
            Increment
          </button>
          <button type='button' onClick={() => setValue(value - 1)}>
            Decrement
          </button>
        </>
      )}
      {value === undefined && (
        <button type='button' onClick={() => setValue(0)}>
          Set
        </button>
      )}
      <button type='button' onClick={() => removeValue()}>
        Remove
      </button>
    </div>
  );
};

export default Demo;
