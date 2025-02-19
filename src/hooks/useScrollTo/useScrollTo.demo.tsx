import { useScrollTo } from './useScrollTo';

const Demo = () => {
  const scrollTo = useScrollTo<HTMLDivElement>({ x: 0, y: 260 });

  return (
    <div>
      <div ref={scrollTo.ref} className='overflow-auto p-5 h-[300px]'>
        <div className='w-full p-5 text-center border border-gray-300 rounded-md h-[250px] mb-2.5'>
          <code>First</code> amazing block
        </div>
        <div className='w-full p-5 text-center border border-gray-300 rounded-md h-[250px] mb-2.5'>
          <code>Second</code> amazing block
        </div>
        <div className='w-full p-5 text-center border border-gray-300 rounded-md h-[250px] mb-2.5'>
          <code>Third</code> amazing block
        </div>
      </div>
      <p>
        Scroll to:
      </p>
      <div className='flex w-full gap-2'>
        <button type='button' onClick={() => scrollTo.trigger({ x: 0, y: 0, behavior: 'smooth' })}>
          1
        </button>
        <button type='button' onClick={() => scrollTo.trigger({ x: 0, y: 260, behavior: 'smooth' })}>
          2
        </button>
        <button type='button' onClick={() => scrollTo.trigger({ x: 0, y: 520, behavior: 'smooth' })}>
          3
        </button>
      </div>
    </div>
  );
};

export default Demo;
