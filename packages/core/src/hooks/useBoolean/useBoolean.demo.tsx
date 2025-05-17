import { useBoolean } from '@siberiacancode/reactuse';

const Demo = () => {
  const [on, toggle] = useBoolean();

  return (
    <div>
      <p>
        Value: <code>{String(on)}</code>
      </p>
      <button type='button' onClick={() => toggle()}>
        Toggle
      </button>
      <button type='button' onClick={() => toggle(true)}>
        Set (true)
      </button>
      <button type='button' onClick={() => toggle(false)}>
        Set (false)
      </button>
    </div>
  );
};

export default Demo;
