import { useColorMode } from './useColorMode';

const Demo = () => {
  const colorMode = useColorMode();

  const toggleColorMode = () =>
    colorMode.set(
      colorMode.value === 'dark' ? 'light' : colorMode.value === 'light' ? 'auto' : 'dark'
    );

  return (
    <>
      <button onClick={toggleColorMode}>{colorMode.value}</button>
      <p>Click to change the color mode</p>
    </>
  );
};

export default Demo;
