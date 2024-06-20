import { useState } from 'react';

import { useInfiniteScroll } from './useInfiniteScroll';

const Demo = () => {
  const [data, setData] = useState([1, 2, 3, 4, 5, 6]);

  const ref = useInfiniteScroll<HTMLDivElement>(
    () => {
      setData((prevData) => {
        const length = prevData.length + 1;
        return [...prevData, ...new Array(5).fill(null).map((_, i) => length + i)];
      });
    },
    { distance: 10 }
  );

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '16px',
        margin: 'auto',
        width: '300px',
        height: '300px',
        overflowY: 'scroll',
        background: '#6b72800d',
        borderRadius: '4px'
      }}
    >
      {data.map((item) => (
        <div
          key={item}
          style={{
            background: '#6b72800d',
            borderRadius: '4px',
            padding: '12px'
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default Demo;
