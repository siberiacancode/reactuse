import { useInfiniteScroll, useList } from '@siberiacancode/reactuse';

const Demo = () => {
  const list = useList([1, 2, 3, 4, 5, 6]);
  const infiniteScroll = useInfiniteScroll<HTMLDivElement>(
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
      className='mx-auto flex h-[300px] w-[300px] flex-col gap-2 overflow-y-scroll rounded bg-slate-500/5 p-4'
    >
      {list.value.map((item) => (
        <div key={item} className='rounded bg-slate-500/5 p-3'>
          {item}
        </div>
      ))}
      {infiniteScroll.loading && <div>Loading...</div>}
    </div>
  );
};

export default Demo;
