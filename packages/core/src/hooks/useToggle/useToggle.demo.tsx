import { useToggle } from '@siberiacancode/reactuse';

const Demo = () => {
  const [value, toggle] = useToggle(['blue', 'orange', 'black', 'teal', 'purple'] as const);

  return (
    <button style={{ backgroundColor: value }} type='button' onClick={() => toggle()}>
      {value}
    </button>
  );
};

export default Demo;
