import { useHover } from './useHover';

const Demo = () => {
  const [hoverRef, isHover] = useHover<HTMLDivElement>(() => console.log('callback'));

  return (
    <div ref={hoverRef}>
      The current div is <code>{isHover ? 'hovered' : 'unhovered'}</code>
    </div>
  );
};

export default Demo;
