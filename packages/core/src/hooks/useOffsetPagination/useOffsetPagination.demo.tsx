import { useOffsetPagination } from '@siberiacancode/reactuse';
import { useState } from 'react';

const TOTAL = 80;
const PAGE_SIZE = 10;

const Demo = () => {
  const [data, setData] = useState<{ id: number }[]>(() =>
    Array.from({ length: PAGE_SIZE }, (_, i) => ({ id: i }))
  );

  const { page, pageSize, isFirstPage, isLastPage, next, setPage, pageCount, prev } =
    useOffsetPagination({
      initialPage: 1,
      onChange: ({ page }) =>
        setData(
          Array.from({ length: PAGE_SIZE }, (_, i) => ({
            id: PAGE_SIZE * (page - 1) + i
          }))
        ),
      total: TOTAL,
      initialPageSize: PAGE_SIZE
    });

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <div className='inline-grid grid-cols-2 items-center gap-x-4 gap-y-2'>
          <div>page:</div>
          <div>
            <code>{page}</code>
          </div>
          <div>pageCount:</div>
          <div>
            <code>{pageCount}</code>
          </div>
          <div>pageSize:</div>
          <div>
            <code>{pageSize}</code>
          </div>
          <div>isFirstPage:</div>
          <div>
            <code>{String(isFirstPage)}</code>
          </div>
          <div>isLastPage:</div>
          <div>
            <code>{String(isLastPage)}</code>
          </div>
        </div>
      </div>

      <div>
        <button disabled={isFirstPage} type='button' onClick={prev}>
          prev
        </button>
        {Array.from({ length: pageCount }, (_, i) => (
          <button key={i} disabled={i + 1 === page} type='button' onClick={() => setPage(i + 1)}>
            {i + 1}{' '}
          </button>
        ))}
        <button disabled={isLastPage} type='button' onClick={next}>
          next
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <td>id</td>
            <td>name</td>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>user {user.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Demo;
