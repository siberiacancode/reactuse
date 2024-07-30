import { useCssVar } from './useCssVar';

const Demo = () => {
  const counter = useCssVar('--count');

  return (
    <p>
      Count: <code>{counter}</code>
    </p>
  );
};

export default Demo;
