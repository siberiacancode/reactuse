import { act, renderHook } from '@testing-library/react';

import { useOffsetPagination } from './useOffsetPagination';

it('Should use offset pagination', () => {
  const { result } = renderHook(useOffsetPagination);

  expect(result.current.page).toBe(1);
  expect(result.current.pageSize).toBe(10);
  expect(result.current.pageCount).toBe(Number.POSITIVE_INFINITY);
  expect(result.current.isFirstPage).toBe(true);
  expect(result.current.isLastPage).toBe(false);
  expect(result.current.next).toBeTypeOf('function');
  expect(result.current.prev).toBeTypeOf('function');
  expect(result.current.setPage).toBeTypeOf('function');
  expect(result.current.setPageSize).toBeTypeOf('function');
});

it('Should set initial options', () => {
  const { result } = renderHook(() =>
    useOffsetPagination({
      initialPage: 3,
      initialPageSize: 20,
      total: 100
    })
  );

  expect(result.current.page).toBe(3);
  expect(result.current.pageSize).toBe(20);
  expect(result.current.pageCount).toBe(5);
  expect(result.current.isFirstPage).toBe(false);
  expect(result.current.isLastPage).toBe(false);
});

it('Should calculate page count', () => {
  const { result } = renderHook(() =>
    useOffsetPagination({
      total: 95,
      initialPageSize: 10
    })
  );

  expect(result.current.pageCount).toBe(10);
});

it('Should return minimum one page when total is zero', () => {
  const { result } = renderHook(() =>
    useOffsetPagination({
      total: 0,
      initialPageSize: 10
    })
  );

  expect(result.current.pageCount).toBe(1);
  expect(result.current.isFirstPage).toBe(true);
  expect(result.current.isLastPage).toBe(true);
});

it('Should detect first page', () => {
  const { result } = renderHook(() =>
    useOffsetPagination({ initialPage: 1, total: 100, initialPageSize: 10 })
  );
  expect(result.current.isFirstPage).toBe(true);

  act(() => result.current.next());

  expect(result.current.isFirstPage).toBe(false);
});

it('Should detect last page', () => {
  const { result } = renderHook(() =>
    useOffsetPagination({ initialPage: 9, total: 100, initialPageSize: 10 })
  );
  expect(result.current.isLastPage).toBe(false);

  act(() => result.current.next());

  expect(result.current.isLastPage).toBe(true);
});

it('Should go to next page', () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useOffsetPagination({
      initialPage: 1,
      total: 100,
      initialPageSize: 10,
      onChange
    })
  );

  act(() => result.current.next());

  expect(result.current.page).toBe(2);
  expect(onChange).toHaveBeenCalledWith({ page: 2, pageSize: 10 });
});

it('Should go to previous page', () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useOffsetPagination({
      initialPage: 3,
      total: 100,
      initialPageSize: 10,
      onChange
    })
  );

  act(() => result.current.prev());

  expect(result.current.page).toBe(2);
  expect(onChange).toHaveBeenCalledWith({ page: 2, pageSize: 10 });
});

it('Should set specific page', () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useOffsetPagination({
      initialPage: 1,
      total: 100,
      initialPageSize: 10,
      onChange
    })
  );

  act(() => result.current.setPage(5));

  expect(result.current.page).toBe(5);
  expect(onChange).toHaveBeenCalledWith({ page: 5, pageSize: 10 });
});

it('Should set page size', () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useOffsetPagination({
      initialPage: 1,
      total: 100,
      initialPageSize: 10,
      onChange
    })
  );

  act(() => result.current.setPageSize(20));

  expect(result.current.pageSize).toBe(20);
});

it('Should not go beyond last page on next', () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useOffsetPagination({
      initialPage: 10,
      total: 100,
      initialPageSize: 10,
      onChange
    })
  );

  expect(result.current.page).toBe(10);
  expect(result.current.isLastPage).toBe(true);

  act(() => result.current.next());

  expect(result.current.page).toBe(10);
  expect(onChange).toHaveBeenCalledWith({ page: 10, pageSize: 10 });
});

it('Should not go before first page on prev', () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useOffsetPagination({
      initialPage: 1,
      total: 100,
      initialPageSize: 10,
      onChange
    })
  );

  expect(result.current.isFirstPage).toBe(true);

  act(() => result.current.prev());

  expect(result.current.page).toBe(1);
  expect(onChange).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
});

it('Should handle sequential navigation', () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useOffsetPagination({
      initialPage: 5,
      total: 100,
      initialPageSize: 10,
      onChange
    })
  );

  act(() => result.current.prev());

  expect(result.current.page).toBe(4);

  act(() => result.current.next());

  expect(result.current.page).toBe(5);

  expect(onChange).toHaveBeenCalledTimes(2);
});
