import { useElementVisibility } from '@siberiacancode/reactuse';

const Demo = () => {
  const visibility = useElementVisibility<HTMLDivElement>();

  return (
    <div className='relative'>
      <div className='text-center'>
        Element <code className='font-bold'>{visibility.inView ? 'inside' : 'outside'}</code> the
        viewport
      </div>

      <div
        ref={visibility.ref}
        className='mx-auto mt-10 rounded-xl border-2 border-dashed border-blue-500 p-6'
      >
        <p className='text-center font-semibold'>Hello element visibility!</p>
      </div>

      <div className='fixed right-4 bottom-4 z-100 rounded-lg border-3 border-dashed bg-[var(--vp-code-block-bg)] px-4 py-2'>
        {visibility.inView ? '✅ In View' : '❌ Out of View'}
      </div>
    </div>
  );
};

export default Demo;
