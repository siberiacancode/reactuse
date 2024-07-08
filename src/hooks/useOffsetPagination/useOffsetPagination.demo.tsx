import { useState } from 'react';

import { useOffsetPagination } from './useOffsetPagination';

const TOTAL = 80;
const PAGE_SIZE = 10;

const Demo = () => {
  const [data, setData] = useState<{ id: number }[]>(() =>
    Array.from({ length: PAGE_SIZE }, (_, i) => ({ id: i }))
  );

  const [page, setPage] = useState(1);

  const onPageChange = (page: number) => {
    setPage(page);
    setData(Array.from({ length: PAGE_SIZE }, (_, i) => ({ id: PAGE_SIZE * (page - 1) + i })));
  };

  const { currentPage, currentPageSize, isFirstPage, isLastPage, next, pageCount, prev } =
    useOffsetPagination({
      page,
      onPageChange,
      total: TOTAL,
      pageSize: PAGE_SIZE
    });

  return (
    <div>
      <div>
        <div>pageCount: {pageCount}</div>
        <div>currentPageSize: {currentPageSize}</div>
        <div>currentPage: {currentPage}</div>
        <div>isFirstPage: {String(isFirstPage)}</div>
        <div>isLastPage: {String(isLastPage)}</div>
      </div>

      <div>
        <button type='button' disabled={isFirstPage} onClick={prev}>
          prev
        </button>
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            type='button'
            disabled={i + 1 === currentPage}
            onClick={() => setPage(i + 1)}
          >
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
