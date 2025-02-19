import { useTextDirection } from './useTextDirection';

const Demo = () => {
  const textDirection = useTextDirection<HTMLDivElement>();

  return (
    <div ref={textDirection.ref}>
      <p>
        {textDirection.value === 'ltr' && 'This paragraph is left-to-right text.'}
        {textDirection.value === 'rtl' && 'This paragraph is right-to-left text.'}
      </p>
      <hr />
      <div className='flex items-center gap-5 text-zinc-500'>
        <button
          type='button'
          onClick={() => textDirection.set(textDirection.value === 'ltr' ? 'rtl' : 'ltr')}
        >
          {textDirection.value === 'ltr' && 'LTR'}
          {textDirection.value === 'rtl' && 'RTL'}
        </button>
        <span>Click to change the direction</span>
      </div>
    </div>
  );
};

export default Demo;
