import { useList } from '../useList/useList';
import { useInfiniteScroll } from './useInfiniteScroll';

const Demo = () => {
  const list = useList([1, 2, 3, 4, 5, 6]);
  const infiniteScroll = useInfiniteScroll<HTMLDivElement>(
    async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      list.set((prevList) => {
        const length = prevList.length + 1;
        return [
          ...prevList,
          ...Array.from({ length: 5 })
            .fill(null)
            .map((_, i) => length + i)
        ];
      });
    },
    { distance: 10 }
  );

  return (
    <div
      ref={infiniteScroll.ref}
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
      {list.value.map((item) => (
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
      {infiniteScroll.isLoading && <div>Loading...</div>}
    </div>
  );
};

export default Demo;
