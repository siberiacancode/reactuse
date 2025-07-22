import { useStorage } from '@siberiacancode/reactuse';

const Demo = () => {
  const { value, set, remove } = useStorage('siberiacancode-use-storage', '');

  return (
    <div>
      <p>
        String: <code>{value || 'value is empty'}</code>
      </p>
      <input type='text' value={value ?? ''} onChange={(event) => set(event.target.value)} />
      <button type='button' onClick={remove}>
        Remove
      </button>
    </div>
  );
};

export default Demo;
