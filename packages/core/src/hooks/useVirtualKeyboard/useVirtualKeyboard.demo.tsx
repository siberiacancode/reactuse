import { useVirtualKeyboard } from './useVirtualKeyboard';

const Demo = () => {
  const virtualKeyboard = useVirtualKeyboard();

  if (!virtualKeyboard.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <div className='flex flex-col gap-1'>
      <p>
        <strong>Keyboard Status:</strong> {virtualKeyboard.opened ? '⌨️ Open' : '🔒 Closed'}
      </p>

      <div className='flex flex-col gap-1'>
        <div>
          <input
            className='w-full max-w-[300px] p-2 text-[20px]'
            placeholder='Focus here to test keyboard detection'
          />
        </div>
        <div>
          {'virtualKeyboard' in navigator && (
            <button
              type='button'
              onClick={virtualKeyboard.opened ? virtualKeyboard.hide : virtualKeyboard.show}
            >
              {virtualKeyboard.opened ? 'Hide' : 'Show'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Demo;
