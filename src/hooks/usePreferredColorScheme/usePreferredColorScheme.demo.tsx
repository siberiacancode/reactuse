import { usePreferredColorScheme } from './usePreferredColorScheme';

const Demo = () => {
  const preferredColorScheme = usePreferredColorScheme();

  return <p>Preferred color scheme: {preferredColorScheme}</p>;
};

export default Demo;
