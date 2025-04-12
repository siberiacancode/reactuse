import { usePreferredContrast } from '@siberiacancode/reactuse';

const Demo = () => {
  const contrast = usePreferredContrast();

  return (
    <div>
      Preferred contrast <code>{String(contrast)}</code>
    </div>
  );
};

export default Demo;
