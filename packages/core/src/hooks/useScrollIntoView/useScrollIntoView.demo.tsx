import { useScrollIntoView } from '@siberiacancode/reactuse';

const Demo = () => {
  const scrollIntoView = useScrollIntoView<HTMLDivElement>({ behavior: 'smooth', block: 'center' });

  return (
    <div
      ref={scrollIntoView.ref}
      className='p-15 m-2 w-full rounded-md border border-gray-300 text-center'
    >
      <p>Scroll into view block</p>
      <p>
        <button
          className='mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
          type='button'
          onClick={() => scrollIntoView.trigger({ behavior: 'smooth', block: 'center' })}
        >
          Click to scroll into view
        </button>
      </p>
    </div>
  );
};

export default Demo;
