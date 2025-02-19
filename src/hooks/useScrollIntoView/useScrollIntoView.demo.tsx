import { useScrollIntoView } from './useScrollIntoView';

const Demo = () => {
  const scrollIntoView = useScrollIntoView<HTMLDivElement>({ behavior: 'smooth', block: 'center' });

  return (

    <div ref={scrollIntoView.ref} className='m-2 w-full p-15 text-center border border-gray-300 rounded-md'>
      <p>
        Scroll into view block
      </p>
      <p>
        <button
          onClick={() => scrollIntoView.trigger({ behavior: 'smooth', block: 'center' })}
          className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Click to scroll into view
        </button>
      </p>
    </div>

  );
};

export default Demo;
