import { useTextareaAutosize } from './useTextareaAutosize';

const Demo = () => {
  const textareaAutosize = useTextareaAutosize();

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col gap-2'>
        <div className='text-medium'>Type, the textarea will grow:</div>
        <textarea
          ref={textareaAutosize.ref}
          style={{
            minHeight: '60px',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}
          placeholder='Start typing...'
        />
        <div className='flex items-center gap-2'>
          <button
            className='rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300'
            onClick={textareaAutosize.clear}
          >
            Clear
          </button>

          <div className='text-medium'>
            Characters: {textareaAutosize.value.length} | Lines:{' '}
            {textareaAutosize.value.split('\n').length}
          </div>
        </div>
      </div>

      <style>{`
        textarea::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Demo;
