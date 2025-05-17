import { usePreferredColorScheme } from '@siberiacancode/reactuse';

const Demo = () => {
  const preferredColorScheme = usePreferredColorScheme();

  return (
    <p>
      Preferred color scheme: <code>{preferredColorScheme}</code>
    </p>
  );
};

export default Demo;
