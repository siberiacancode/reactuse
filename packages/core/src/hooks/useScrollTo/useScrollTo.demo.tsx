import { useScrollTo } from '@siberiacancode/reactuse';

const Demo = () => {
  const scrollTo = useScrollTo<HTMLDivElement>({
    x: 0,
    y: 260,
    behavior: 'smooth'
  });

  return (
    <div>
      <div ref={scrollTo.ref} className='h-[300px] overflow-auto p-5'>
        <div className='mb-2.5 h-[250px] w-full rounded-md border border-gray-300 p-5 text-center'>
          <code>First</code> amazing block
        </div>
        <div className='mb-2.5 h-[250px] w-full rounded-md border border-gray-300 p-5 text-center'>
          <code>Second</code> amazing block
        </div>
        <div className='mb-2.5 h-[250px] w-full rounded-md border border-gray-300 p-5 text-center'>
          <code>Third</code> amazing block
        </div>
      </div>
      <p>Scroll to:</p>
      <div className='flex w-full gap-2'>
        <button type='button' onClick={() => scrollTo.trigger({ x: 0, y: 0, behavior: 'smooth' })}>
          1
        </button>
        <button
          type='button'
          onClick={() => scrollTo.trigger({ x: 0, y: 260, behavior: 'smooth' })}
        >
          2
        </button>
        <button
          type='button'
          onClick={() => scrollTo.trigger({ x: 0, y: 520, behavior: 'smooth' })}
        >
          3
        </button>
      </div>
    </div>
  );
};

export default Demo;
