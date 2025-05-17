import { useBoolean, useOnce } from '@siberiacancode/reactuse';

const Component = () => {
  useOnce(() => alert('mount'));

  return <p>Hello World!</p>;
};

const Demo = () => {
  const [on, toggle] = useBoolean(false);

  return (
    <>
      <button type='button' onClick={() => toggle()}>
        {on ? 'Unmount' : 'Mount'}
      </button>
      {on && <Component />}

      <p>
        <small>effect runs only once (will not run twice in strict mode)</small>
      </p>
    </>
  );
};

export default Demo;
