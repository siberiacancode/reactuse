import { useRef, useState } from 'react';

/** The use offset pagination return type */
export interface UseOffsetPaginationOptions {
  /** The initial page number */
  initialPage?: number;
  /** The number of items per page */
  initialPageSize?: number;
  /** The total number of items */
  total?: number;
  /** The callback function to be invoked when page changes */
  onChange?: ({ page, pageSize }: { page: number; pageSize: number }) => void;
}

/** The use offset pagination return type */
export interface UseOffsetPaginationReturn {
  /** Whether the current page is the first page */
  isFirstPage: boolean;
  /** Whether the current page is the last page */
  isLastPage: boolean;
  /** The current page number */
  page: number;
  /** The total number of pages */
  pageCount: number;
  /** The number of items per page */
  pageSize: number;
  /** The callback function to go to the next page */
  next: () => void;
  /** The callback function to go to the previous page */
  prev: () => void;
  /** The callback function to set the current page */
  setPage: (page: number) => void;
  /** The callback function to set the page size */
  setPageSize: (pageSize: number) => void;
}

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
}: UseOffsetPaginationOptions = {}): UseOffsetPaginationReturn => {
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

  const set = (page: number) => {
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
