import { useState } from 'react';

import { useResizeObserver } from './useResizeObserver';

const Demo = () => {
  const [text, setText] = useState('');
  const resizeObserver = useResizeObserver<HTMLTextAreaElement>({
    onChange: ([entry]) => {
      const { width, height } = entry.contentRect;
      setText(`width: ${width}\nheight: ${height}`);
    }
  });

  return (
    <div className='flex flex-col gap-4'>
      <p>Resize the box to see changes</p>
      <textarea
        disabled
        ref={resizeObserver.ref}
        className='h-[200px] w-[200px]'
        style={{ resize: 'both' }}
        value={text}
      />
    </div>
  );
};

export default Demo;
