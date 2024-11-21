import { useBoolean } from '../useBoolean/useBoolean';
import { useMount } from './useMount';

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
