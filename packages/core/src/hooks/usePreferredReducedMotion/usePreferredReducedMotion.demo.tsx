import { usePreferredReducedMotion } from '@siberiacancode/reactuse';

const Demo = () => {
  const motion = usePreferredReducedMotion();

  return (
    <div>
      Preferred reduced motion <code>{String(motion)}</code>
    </div>
  );
};

export default Demo;
