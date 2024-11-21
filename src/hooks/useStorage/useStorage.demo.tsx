import { useLocalStorage } from '../useLocalStorage/useLocalStorage';
import { useStorage } from './useStorage';

const Demo = () => {
  useLocalStorage('test2');
  const { value, set, remove } = useStorage('siberiacancode-use-storage', '');

  return (
    <div>
      <p>
        String: <code>{value ?? 'value is undefined'}</code>
      </p>
      <input type='text' value={value ?? ''} onChange={(event) => set(event.target.value)} />
      <button type='button' onClick={remove}>
        Remove
      </button>
    </div>
  );
};

export default Demo;
