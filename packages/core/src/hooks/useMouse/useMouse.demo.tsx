import { useMouse } from './useMouse';

const Demo = () => {
  const { ref, x, y, elementX, elementY } = useMouse<HTMLDivElement>();

  return (
    <div ref={ref}>
      <p>Mouse position</p>

      <p>
        x: <code>{x}</code>
      </p>
      <p>
        y: <code>{y}</code>
      </p>

      <p>Element position</p>

      <p>
        x: <code>{elementX}</code>
      </p>
      <p>
        y: <code>{elementY}</code>
      </p>
    </div>
  );
};

export default Demo;
