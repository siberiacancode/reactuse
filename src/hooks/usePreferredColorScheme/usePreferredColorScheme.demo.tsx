import { usePreferredColorScheme } from './usePreferredColorScheme';

const Demo = () => {
  const colorScheme = usePreferredColorScheme();

  return <p>Preferred Color Scheme: {colorScheme}</p>;
};

export default Demo;
