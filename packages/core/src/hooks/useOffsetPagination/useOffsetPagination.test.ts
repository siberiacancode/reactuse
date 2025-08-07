import { act, renderHook } from '@testing-library/react';

import { useOffsetPagination } from './useOffsetPagination';

it('Should use offset pagination', () => {
  const { result } = renderHook(() => useOffsetPagination());

  expect(result.current.page).toBe(1);
  expect(result.current.currentPageSize).toBe(10);
  expect(result.current.pageCount).toBe(Number.POSITIVE_INFINITY);
  expect(result.current.isFirstPage).toBe(true);
  expect(result.current.isLastPage).toBe(false);
  expect(result.current.next).toBeTypeOf('function');
  expect(result.current.prev).toBeTypeOf('function');
  expect(result.current.set).toBeTypeOf('function');
});

it('Should set initial options', () => {
  const { result } = renderHook(() =>
    useOffsetPagination({
      initialPage: 3,
      pageSize: 20,
      total: 100
    })
  );

  expect(result.current.page).toBe(3);
  expect(result.current.currentPageSize).toBe(20);
  expect(result.current.pageCount).toBe(5);
  expect(result.current.isFirstPage).toBe(false);
  expect(result.current.isLastPage).toBe(false);
});

it('Should calculate page count', () => {
  const { result } = renderHook(() =>
    useOffsetPagination({
      total: 95,
      pageSize: 10
    })
  );

  expect(result.current.pageCount).toBe(10);
});

it('Should return minimum 1 page when total is 0', () => {
  const { result } = renderHook(() =>
    useOffsetPagination({
      total: 0,
      pageSize: 10
    })
  );

  expect(result.current.pageCount).toBe(1);
});

it('Should detect first page', () => {
  const { result: result1 } = renderHook(() =>
    useOffsetPagination({ initialPage: 1, total: 100, pageSize: 10 })
  );
  expect(result1.current.isFirstPage).toBe(true);

  const { result: result2 } = renderHook(() =>
    useOffsetPagination({ initialPage: 2, total: 100, pageSize: 10 })
  );
  expect(result2.current.isFirstPage).toBe(false);
});

it('Should detect last page', () => {
  const { result: result1 } = renderHook(() =>
    useOffsetPagination({ initialPage: 10, total: 100, pageSize: 10 })
  );
  expect(result1.current.isLastPage).toBe(true);

  const { result: result2 } = renderHook(() =>
    useOffsetPagination({ initialPage: 9, total: 100, pageSize: 10 })
  );
  expect(result2.current.isLastPage).toBe(false);
});

it('Should go to next page', () => {
  const onPageChange = vi.fn();
  const { result } = renderHook(() =>
    useOffsetPagination({
      initialPage: 1,
      total: 100,
      pageSize: 10,
      onPageChange
    })
  );

  act(() => {
    result.current.next();
  });

  expect(result.current.page).toBe(2);
  expect(onPageChange).toHaveBeenCalledWith({ page: 2, pageSize: 10 });
});

it('Should go to previous page', () => {
  const onPageChange = vi.fn();
  const { result } = renderHook(() =>
    useOffsetPagination({
      initialPage: 3,
      total: 100,
      pageSize: 10,
      onPageChange
    })
  );

  act(() => {
    result.current.prev();
  });

  expect(result.current.page).toBe(2);
  expect(onPageChange).toHaveBeenCalledWith({ page: 2, pageSize: 10 });
});

it('Should set specific page', () => {
  const onPageChange = vi.fn();
  const { result } = renderHook(() =>
    useOffsetPagination({
      initialPage: 1,
      total: 100,
      pageSize: 10,
      onPageChange
    })
  );

  act(() => {
    result.current.set(5);
  });

  expect(result.current.page).toBe(5);
  expect(onPageChange).toHaveBeenCalledWith({ page: 5, pageSize: 10 });
});

it('Should not go beyond last page on next', () => {
  const onPageChange = vi.fn();
  const { result } = renderHook(() =>
    useOffsetPagination({
      initialPage: 10,
      total: 100,
      pageSize: 10,
      onPageChange
    })
  );

  expect(result.current.isLastPage).toBe(true);

  act(() => {
    result.current.next();
  });

  expect(result.current.page).toBe(10);
  expect(onPageChange).toHaveBeenCalledWith({ page: 10, pageSize: 10 });
});

it('Should not go before first page on prev', () => {
  const onPageChange = vi.fn();
  const { result } = renderHook(() =>
    useOffsetPagination({
      initialPage: 1,
      total: 100,
      pageSize: 10,
      onPageChange
    })
  );

  expect(result.current.isFirstPage).toBe(true);

  act(() => {
    result.current.prev();
  });

  expect(result.current.page).toBe(1);
  expect(onPageChange).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
});

it('Should call onPageCountChange when page count changes', () => {
  const onPageCountChange = vi.fn();
  const { rerender } = renderHook(
    ({ total }) =>
      useOffsetPagination({
        total,
        pageSize: 10,
        onPageCountChange
      }),
    { initialProps: { total: 100 } }
  );

  expect(onPageCountChange).toHaveBeenCalledWith({ page: 1, pageSize: 10 });

  rerender({ total: 50 });

  expect(onPageCountChange).toHaveBeenCalledTimes(2);
});

it('Should call onPageSizeChange when page size changes', () => {
  const onPageSizeChange = vi.fn();
  const { rerender } = renderHook(
    ({ pageSize }) =>
      useOffsetPagination({
        total: 100,
        pageSize,
        onPageSizeChange
      }),
    { initialProps: { pageSize: 10 } }
  );

  expect(onPageSizeChange).toHaveBeenCalledWith({ page: 1, pageSize: 10 });

  rerender({ pageSize: 20 });

  expect(onPageSizeChange).toHaveBeenCalledTimes(2);
  expect(onPageSizeChange).toHaveBeenLastCalledWith({ page: 1, pageSize: 20 });
});

it('Should update callback refs without rerender', () => {
  const onPageChange1 = vi.fn();
  const onPageChange2 = vi.fn();

  const { result, rerender } = renderHook(
    ({ onPageChange }) =>
      useOffsetPagination({
        total: 100,
        pageSize: 10,
        onPageChange
      }),
    { initialProps: { onPageChange: onPageChange1 } }
  );

  rerender({ onPageChange: onPageChange2 });

  act(() => {
    result.current.next();
  });

  expect(onPageChange1).not.toHaveBeenCalled();
  expect(onPageChange2).toHaveBeenCalledWith({ page: 2, pageSize: 10 });
});

it('Should work with infinite total', () => {
  const { result } = renderHook(() =>
    useOffsetPagination({
      total: Number.POSITIVE_INFINITY,
      pageSize: 10
    })
  );

  expect(result.current.pageCount).toBe(Number.POSITIVE_INFINITY);
  expect(result.current.isLastPage).toBe(false);

  act(() => {
    result.current.next();
  });

  expect(result.current.page).toBe(2);
  expect(result.current.isLastPage).toBe(false);
});

it('Should work with different page sizes', () => {
  const { result: result1 } = renderHook(() =>
    useOffsetPagination({
      total: 100,
      pageSize: 25
    })
  );

  expect(result1.current.pageCount).toBe(4);

  const { result: result2 } = renderHook(() =>
    useOffsetPagination({
      total: 100,
      pageSize: 33
    })
  );

  expect(result2.current.pageCount).toBe(4);
});

it('Should handle sequential navigation', () => {
  const onPageChange = vi.fn();
  const { result } = renderHook(() =>
    useOffsetPagination({
      initialPage: 5,
      total: 100,
      pageSize: 10,
      onPageChange
    })
  );

  act(() => {
    result.current.prev();
  });
  expect(result.current.page).toBe(4);

  act(() => {
    result.current.prev();
  });
  expect(result.current.page).toBe(3);

  act(() => {
    result.current.next();
  });
  expect(result.current.page).toBe(4);

  act(() => {
    result.current.next();
  });
  expect(result.current.page).toBe(5);

  expect(onPageChange).toHaveBeenCalledTimes(4);
});

it('Should handle zero page size', () => {
  const { result } = renderHook(() =>
    useOffsetPagination({
      total: 100,
      pageSize: 0
    })
  );

  expect(result.current.pageCount).toBe(Number.POSITIVE_INFINITY);
  expect(result.current.currentPageSize).toBe(0);
});
