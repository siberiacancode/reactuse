import { useWindowSize } from '@siberiacancode/reactuse';

const Demo = () => {
  const size = useWindowSize();

  return (
    <div>
      <p>Current window size:</p>
      <p>
        <span>
          width: <code>{size.width}</code>
        </span>{' '}
        <span>
          height: <code>{size.height}</code>
        </span>
      </p>
    </div>
  );
};

export default Demo;
