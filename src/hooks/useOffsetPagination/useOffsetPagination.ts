import { useEffect, useRef } from 'react';

export interface UseOffsetPaginationOptions {
  total?: number;
  pageSize?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onPageCountChange?: (pageCount: number) => void;
}

export interface UseOffsetPaginationReturn {
  currentPage: number;
  currentPageSize: number;
  pageCount: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  prev: () => void;
  next: () => void;
}

export const useOffsetPagination = ({
  total = Number.POSITIVE_INFINITY,
  pageSize = 10,
  page = 1,
  onPageChange = () => {},
  onPageCountChange = () => {},
  onPageSizeChange = () => {}
}: UseOffsetPaginationOptions = {}): UseOffsetPaginationReturn => {
  const onPageChangeRef = useRef(onPageChange);
  onPageChangeRef.current = onPageChange;

  const onPageCountChangeRef = useRef(onPageCountChange);
  onPageCountChangeRef.current = onPageCountChange;

  const onPageSizeChangeRef = useRef(onPageSizeChange);
  onPageSizeChangeRef.current = onPageSizeChange;

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const currentPage = Math.max(1, Math.min(page ?? 1, pageCount));

  const currentPageSize = Math.max(1, Math.min(pageSize, Number.POSITIVE_INFINITY));

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pageCount;

  const next = () => {
    onPageChange(isLastPage ? pageCount : currentPage + 1);
  };

  const prev = () => {
    onPageChange(isFirstPage ? 1 : currentPage - 1);
  };

  useEffect(() => {
    onPageCountChangeRef.current(pageCount);
  }, [pageCount]);

  useEffect(() => {
    onPageSizeChangeRef.current(currentPageSize);
  }, [currentPageSize]);

  useEffect(() => {
    onPageChangeRef.current(currentPage);
  }, [currentPage]);

  return {
    currentPage,
    currentPageSize,
    isFirstPage,
    isLastPage,
    pageCount,
    next,
    prev
  };
};
