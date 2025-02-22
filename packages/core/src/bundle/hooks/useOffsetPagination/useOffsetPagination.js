import { useEffect, useRef, useState } from 'react';
/**
 * @name useOffsetPagination
 * @description - Hook that defines the logic when pagination
 * @category Utilities
 *
 * @param {UseOffsetPaginationOptions} options - The options for the hook
 * @param {number} [options.total] - The total number of items
 * @param {number} [options.pageSize] - The number of items per page
 * @param {number} [options.initialPage] - The current page
 * @param {({ page, pageSize }: { page: number; pageSize: number }) => void} [options.onPageChange] - The callback function to be invoked when page changes
 * @param {({ page, pageSize }: { page: number; pageSize: number }) => void} [options.onPageCountChange] - The callback function to be invoked when page count changes
 * @param {({ page, pageSize }: { page: number; pageSize: number }) => void} [options.onPageSizeChange] - The callback function to be invoked when page size changes
 * @returns {UseOffsetPaginationReturn} - The state of the hook
 *
 * @example
 * const { currentPage, currentPageSize, pageCount, isFirstPage, isLastPage, prev, next } = useOffsetPagination({
 *  total: 100,
 *  pageSize: 10,
 *  page: 1,
 *  onPageChange: (page) => {},
 *  onPageCountChange: (pageCount) => {},
 *  onPageSizeChange: (pageSize) => {}
 * });
 */
export const useOffsetPagination = ({
  total = Number.POSITIVE_INFINITY,
  pageSize = 10,
  initialPage = 1,
  onPageChange = () => {},
  onPageCountChange = () => {},
  onPageSizeChange = () => {}
} = {}) => {
  const [page, setPage] = useState(initialPage);
  const onPageChangeRef = useRef(onPageChange);
  const onPageCountChangeRef = useRef(onPageCountChange);
  const onPageSizeChangeRef = useRef(onPageSizeChange);
  onPageChangeRef.current = onPageChange;
  onPageCountChangeRef.current = onPageCountChange;
  onPageSizeChangeRef.current = onPageSizeChange;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const isFirstPage = page === 1;
  const isLastPage = page === pageCount;
  const next = () => {
    if (isLastPage) return onPageChange({ page: pageCount, pageSize });
    setPage((prevPage) => {
      const page = prevPage + 1;
      onPageChange({ page, pageSize });
      return page;
    });
  };
  const prev = () => {
    if (isFirstPage) return onPageChange({ page: 1, pageSize });
    setPage((prevPage) => {
      const page = prevPage - 1;
      onPageChange({ page, pageSize });
      return page;
    });
  };
  const set = (page) => {
    setPage(page);
    onPageChange({ page, pageSize });
  };
  useEffect(() => {
    onPageCountChangeRef.current({ page, pageSize });
  }, [pageCount]);
  useEffect(() => {
    onPageSizeChangeRef.current({ page, pageSize });
  }, [pageSize]);
  return {
    page,
    set,
    currentPageSize: pageSize,
    isFirstPage,
    isLastPage,
    pageCount,
    next,
    prev
  };
};
