import { usePreferredDark } from './usePreferredDark';

const Demo = () => {
  const isDark = usePreferredDark();

  return (
    <div>
      Prefers dark scheme <code>{String(isDark)}</code>
    </div>
  );
};

export default Demo;
