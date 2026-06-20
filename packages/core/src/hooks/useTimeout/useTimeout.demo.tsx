import { useTimeout } from '@siberiacancode/reactuse';

const DELAY = 5000;

const Demo = () => {
  const timeout = useTimeout(() => {}, DELAY);

  return (
    <section className='flex w-full max-w-md flex-col items-center gap-6 p-8'>
      <div
        key={String(timeout.ready)}
        className='animate-in fade-in slide-in-from-bottom-2 duration-500'
      >
        <span className='text-foreground text-5xl font-bold tracking-tight'>
          {timeout.ready ? "You're awesome" : 'Hold on'}
        </span>
      </div>

      <div className='bg-muted h-1 w-32 overflow-hidden rounded-full'>
        <div
          className='bg-foreground h-full origin-left'
          style={{ animation: `progress ${DELAY}ms linear forwards` }}
        />
      </div>

      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
};

export default Demo;
