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
    <>
      <p>Resize the box to see changes</p>
      <textarea disabled ref={resizeObserver.ref} value={text} />
    </>
  );
};

export default Demo;
