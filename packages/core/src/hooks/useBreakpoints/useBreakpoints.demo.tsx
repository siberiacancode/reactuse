import { useBreakpoints } from '@siberiacancode/reactuse';

const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024
};

const Demo = () => {
  const breakpoints = useBreakpoints(BREAKPOINTS);

  const current = breakpoints.current();

  return (
    <section className='flex justify-center p-6'>
      {current.includes('mobile') &&
        !current.includes('tablet') &&
        !current.includes('desktop') && (
          <div className='relative flex h-[430px] w-66 flex-col gap-7 rounded-4xl border px-6 pt-12 pb-8'>
            <div className='bg-border absolute top-3 left-1/2 h-5 w-22 -translate-x-1/2 rounded-full' />

            <div className='flex flex-col gap-2'>
              <h3 className='text-3xl!'>Mobile view</h3>
              <p className='text-muted-foreground text-sm'>
                Compact <code>mobile</code> layout for small screens. Stacked content, tap-friendly
                buttons, and short copy that respects narrow viewports.
              </p>
            </div>
          </div>
        )}

      {current.includes('tablet') && !current.includes('desktop') && (
        <div className='relative flex h-[440px] w-96 flex-col gap-7 rounded-3xl border px-8 pt-10 pb-8'>
          <div className='bg-border absolute top-4 left-1/2 size-2 -translate-x-1/2 rounded-full' />

          <div className='flex flex-col gap-2'>
            <h3 className='text-2xl!'>Tablet view</h3>
            <p className='text-muted-foreground text-sm'>
              Balanced <code>tablet</code> layout for medium screens. More room for content with
              comfortable reading width and side margins.
            </p>
          </div>
        </div>
      )}

      {current.includes('desktop') && (
        <div className='flex flex-col items-center'>
          <div className='relative flex h-72 w-[480px] flex-col gap-6 overflow-hidden rounded-xl border px-8 pt-9 pb-6'>
            <div className='bg-border absolute top-0 left-1/2 h-2 w-16 -translate-x-1/2 rounded-b-md' />

            <div className='flex flex-col gap-2'>
              <h3>Desktop view</h3>
              <p className='text-muted-foreground text-sm'>
                Wide <code>desktop</code> layout for large displays. Multi-column content,
                persistent sidebars, and rich detail panes for productivity.
              </p>
            </div>
          </div>

          <div className='bg-muted h-1.5 w-[540px] rounded-b-lg' />
          <div className='bg-muted/60 -mt-1 h-1 w-20 rounded-b-md' />
        </div>
      )}
    </section>
  );
};

export default Demo;
