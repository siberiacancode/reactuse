import { useHover } from '@siberiacancode/reactuse';

const Demo = () => {
  const hover = useHover<HTMLDivElement>(() => console.log('callback'));

  return (
    <div ref={hover.ref}>
      The current div is <code>{hover.value ? 'hovered' : 'unhovered'}</code>
    </div>
  );
};

export default Demo;
