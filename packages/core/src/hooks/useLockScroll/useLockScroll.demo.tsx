import { useLockScroll } from '@siberiacancode/reactuse';

const Demo = () => {
  const lockScroll = useLockScroll<HTMLDivElement>();

  return (
    <div>
      <div ref={lockScroll.ref} className='relative h-60 overflow-y-auto p-2'>
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} className='my-1.5 rounded bg-[var(--vp-code-block-bg)] p-2.5'>
            Line <code>{i + 1}</code> - This is test content to demonstrate scroll locking. When
            locked, you wont be able to scroll through this content.
          </p>
        ))}
      </div>

      <div className='mt-5 flex justify-center'>
        <button onClick={() => lockScroll.toggle()}>
          {lockScroll.value ? '🔒 Lock Scroll' : '🔓 Unlock Scroll'}
        </button>
      </div>
    </div>
  );
};

export default Demo;
