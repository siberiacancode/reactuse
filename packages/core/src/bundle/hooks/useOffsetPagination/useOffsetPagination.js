import { useRef, useState } from 'react';
/**
 * @name useOffsetPagination
 * @description - Hook that defines the logic when pagination
 * @category State
 *
 * @param {UseOffsetPaginationOptions} options - The options for the hook
 * @param {number} [options.total] - The total number of items
 * @param {number} [options.pageSize] - The number of items per page
 * @param {number} [options.initialPage] - The current page
 * @param {({ page, pageSize }: { page: number; pageSize: number }) => void} [options.onChange] - The callback function to be invoked when page changes
 * @returns {UseOffsetPaginationReturn} - The state of the hook
 *
 * @example
 * const { currentPage, currentPageSize, pageCount, isFirstPage, isLastPage, prev, next } = useOffsetPagination({
 *  total: 100,
 *  initialPageSize: 10,
 *  initialPage: 1
 * });
 */
export const useOffsetPagination = ({
  total = Number.POSITIVE_INFINITY,
  initialPage = 1,
  initialPageSize = 10,
  onChange = () => {}
} = {}) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const isFirstPage = page === 1;
  const isLastPage = page === pageCount;
  const next = () => {
    if (isLastPage) return onChange({ page: pageCount, pageSize });
    setPage((prevPage) => {
      const page = prevPage + 1;
      onChange({ page, pageSize });
      return page;
    });
  };
  const prev = () => {
    if (isFirstPage) return onChange({ page: 1, pageSize });
    setPage((prevPage) => {
      const page = prevPage - 1;
      onChange({ page, pageSize });
      return page;
    });
  };
  const set = (page) => {
    setPage(page);
    onChange({ page, pageSize });
  };
  return {
    page,
    setPage: set,
    setPageSize,
    pageSize,
    isFirstPage,
    isLastPage,
    pageCount,
    next,
    prev
  };
};
