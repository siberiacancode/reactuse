import { useOnce } from '@siberiacancode/reactuse';

const Demo = () => {
  useOnce(() => {
    console.log('effect ran once');
  });

  return (
    <section className='flex w-full max-w-md flex-col items-center gap-3 p-6'>
      <div className='flex flex-col items-center gap-1 text-center'>
        <h2 className='text-foreground text-sm font-semibold'>This effect ran once</h2>
        <p className='text-muted-foreground text-xs'>
          With <b>useOnce</b> the effect fires a single time, even in Strict Mode where a regular
          effect would run twice. Open the console to see the log.
        </p>
      </div>
    </section>
  );
};

export default Demo;
