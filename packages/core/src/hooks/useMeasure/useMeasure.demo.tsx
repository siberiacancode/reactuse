import { useMeasure } from '@siberiacancode/reactuse';

const Demo = () => {
  const measure = useMeasure<HTMLDivElement>();

  return (
    <div
      ref={measure.ref}
      style={{
        width: 200,
        resize: 'horizontal',
        overflow: 'auto'
      }}
    >
      <p>
        width: <code>{Math.floor(measure.width)}</code>
      </p>
      <p>
        height: <code>{Math.floor(measure.height)}</code>
      </p>
      <p>
        right: <code>{Math.floor(measure.right)}</code>
      </p>
      <p>
        bottom: <code>{Math.floor(measure.bottom)}</code>
      </p>
    </div>
  );
};

export default Demo;
