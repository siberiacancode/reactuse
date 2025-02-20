import { useWindowFocus } from './useWindowFocus';

const Demo = () => {
  const windowFocused = useWindowFocus();

  return (
    <p>
      {windowFocused && '💡 Click somewhere outside of the document to unfocus.'}
      {!windowFocused && 'ℹ Tab is unfocused'}
    </p>
  );
};

export default Demo;
