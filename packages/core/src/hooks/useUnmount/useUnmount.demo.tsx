import { useBoolean, useUnmount } from '@siberiacancode/reactuse';

const Component = () => {
  useUnmount(() => alert('unmount'));

  return <p>Hello World!</p>;
};

const Demo = () => {
  const [on, toggle] = useBoolean(true);

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
