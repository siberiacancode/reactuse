import { useColorMode } from './useColorMode';

const Demo = () => {
  const [mode, setMode] = useColorMode();

  return (
    <>
      <p>
        current mode: {mode}
      </p>
      <button type='button' onClick={() => setMode('auto')}>auto</button>
      <button type='button' onClick={() => setMode('light')}>light</button>
      <button type='button' onClick={() => setMode('dark')}>dark</button>
    </>
  );
};

export default Demo;
