import { useLocalStorage } from '@siberiacancode/reactuse';

const Demo = () => {
  const { value, set, remove } = useLocalStorage('siberiacancode-use-local-storage', 0);

  return (
    <div>
      <p>
        Count: <code>{value ?? 'value is undefined'}</code>
      </p>
      {value !== undefined && (
        <>
          <button type='button' onClick={() => set(value + 1)}>
            Increment
          </button>
          <button type='button' onClick={() => set(value - 1)}>
            Decrement
          </button>
        </>
      )}
      {value === undefined && (
        <button type='button' onClick={() => set(0)}>
          Set
        </button>
      )}
      <button type='button' onClick={remove}>
        Remove
      </button>
    </div>
  );
};

export default Demo;
