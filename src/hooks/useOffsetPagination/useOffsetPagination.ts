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

/**
 * @name useFullscreen
 * @description - Hook to handle fullscreen events
 * @category Browser
 *
 * @overload
 * @template Target The target element for fullscreen
 * @param {Target} target The target element for fullscreen
 * @param {boolean} [options.initialValue=false] initial value of fullscreen
 * @param {() => void} [options.onEnter] on enter fullscreen
 * @param {() => void} [options.onExit] on exit fullscreen
 * @returns {UseFullScreenReturn} An object with the fullscreen state and methods
 *
 * @example
 * const { enter, exit, toggle, value } = useFullscreen(ref);
 *
 * @overload
 * @template Target The target element for fullscreen
 * @param {boolean} [options.initialValue=false] initial value of fullscreen
 * @param {() => void} [options.onEnter] on enter fullscreen
 * @param {() => void} [options.onExit] on exit fullscreen
 * @returns {UseFullScreenReturn & { ref: RefObject<Target> }} An object with the fullscreen state and methods
 *
 * @example
 * const { ref, enter, exit, toggle, value } = useFullscreen();
 */
export const useOffsetPagination = ({
  total = Number.POSITIVE_INFINITY,
  pageSize = 10,
  page,
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
