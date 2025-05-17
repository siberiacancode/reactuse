import { usePreferredDark } from '@siberiacancode/reactuse';

const Demo = () => {
  const isDark = usePreferredDark();

  return (
    <div>
      Prefers dark scheme <code>{String(isDark)}</code>
    </div>
  );
};

export default Demo;
