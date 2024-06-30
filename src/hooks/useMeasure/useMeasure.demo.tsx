import { useMeasure } from './useMeasure';

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
        width: <code>{measure.width}</code>
      </p>
      <p>
        height: <code>{measure.height}</code>
      </p>
      <p>
        right: <code>{measure.right}</code>
      </p>
      <p>
        bottom: <code>{measure.bottom}</code>
      </p>
    </div>
  );
};

export default Demo;
