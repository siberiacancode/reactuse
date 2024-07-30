import { useState } from 'react';

import { useOffsetPagination } from './useOffsetPagination';

const TOTAL = 80;
const PAGE_SIZE = 10;

const Demo = () => {
  const [data, setData] = useState<{ id: number }[]>(() =>
    Array.from({ length: PAGE_SIZE }, (_, i) => ({ id: i }))
  );

  const { page, currentPageSize, isFirstPage, isLastPage, next, set, pageCount, prev } =
    useOffsetPagination({
      initialPage: 1,
      onPageChange: ({ page }) =>
        setData(Array.from({ length: PAGE_SIZE }, (_, i) => ({ id: PAGE_SIZE * (page - 1) + i }))),
      total: TOTAL,
      pageSize: PAGE_SIZE
    });

  return (
    <div>
      <p>
        pageCount: <code>{pageCount}</code>
      </p>
      <p>
        currentPageSize: <code>{currentPageSize}</code>
      </p>
      <p>
        currentPage: <code>{page}</code>
      </p>
      <p>
        isFirstPage: <code>{String(isFirstPage)}</code>
      </p>
      <p>
        isLastPage: <code>{String(isLastPage)}</code>
      </p>

      <div>
        <button type='button' disabled={isFirstPage} onClick={prev}>
          prev
        </button>
        {Array.from({ length: pageCount }, (_, i) => (
          <button key={i} type='button' disabled={i + 1 === page} onClick={() => set(i + 1)}>
            {i + 1}{' '}
          </button>
        ))}
        <button type='button' disabled={isLastPage} onClick={next}>
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
