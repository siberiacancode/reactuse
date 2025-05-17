import { useBoolean, useMount } from '@siberiacancode/reactuse';

const Component = () => {
  useMount(() => alert('mount'));

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
    </>
  );
};

export default Demo;
