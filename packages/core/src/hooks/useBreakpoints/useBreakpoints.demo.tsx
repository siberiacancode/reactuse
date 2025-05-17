import { BREAKPOINTS_TAILWIND, useBreakpoints } from '@siberiacancode/reactuse';

const Demo = () => {
  const breakpoints = useBreakpoints(BREAKPOINTS_TAILWIND);

  const current = breakpoints.current();
  const active = breakpoints.active();
  const sm = breakpoints.between('sm', 'md');
  const md = breakpoints.between('md', 'lg');
  const lg = breakpoints.between('lg', 'xl');
  const xl = breakpoints.between('xl', '2xl');

  return (
    <>
      <p>
        Current breakpoints: <code>{JSON.stringify(current, null, 2)}</code>{' '}
      </p>
      <p>
        Active breakpoint: <code>{active}</code>
      </p>
      <p>
        sm: <code>{String(sm)}</code>
      </p>
      <p>
        md: <code>{String(md)}</code>
      </p>
      <p>
        lg: <code>{String(lg)}</code>
      </p>
      <p>
        xl: <code>{String(xl)}</code>
      </p>
      <p>
        2xl: <code>{String(breakpoints['2xl'])}</code>
      </p>
    </>
  );
};

export default Demo;
