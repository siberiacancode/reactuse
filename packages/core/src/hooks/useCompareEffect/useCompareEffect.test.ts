import { act, renderHook } from '@testing-library/react';

import { shallowEqual } from '@/helpers/shallowEqual/shallowEqual';
import { renderHookServer } from '@/tests';

import { useCompareEffect } from './useCompareEffect';

it('Should use compare effect', () => {
  const effect = vi.fn();

  renderHook(() => useCompareEffect(effect, []));

  expect(effect).toHaveBeenCalledOnce();
});

it('Should use compare effect on server side', () => {
  const effect = vi.fn();

  renderHookServer(() => useCompareEffect(effect, []));

  expect(effect).not.toHaveBeenCalled();
});

it('Should not run effect when deps are deep equal by default', () => {
  const effect = vi.fn();
  let object = { a: 'a', b: { c: 'c' } };

  const { rerender } = renderHook(() => useCompareEffect(effect, [object]));

  expect(effect).toHaveBeenCalledOnce();

  act(() => {
    object = { a: 'a', b: { c: 'c' } };
    rerender();
  });

  expect(effect).toHaveBeenCalledOnce();
});

it('Should run effect when nested deps change by default', () => {
  const effect = vi.fn();
  let object = { a: 'a', b: { c: 'c' } };

  const { rerender } = renderHook(() => useCompareEffect(effect, [object]));

  expect(effect).toHaveBeenCalledOnce();

  act(() => {
    object = { a: 'a', b: { c: 'd' } };
    rerender();
  });

  expect(effect).toHaveBeenCalledTimes(2);
});

it('Should not run effect when deps are shallow equal', () => {
  const effect = vi.fn();
  let object = { a: 'a', b: 'b' };

  const { rerender } = renderHook(() => useCompareEffect(effect, [object], shallowEqual));

  expect(effect).toHaveBeenCalledOnce();

  act(() => {
    object = { b: 'b', a: 'a' };
    rerender();
  });

  expect(effect).toHaveBeenCalledOnce();
});

it('Should run effect when nested deps change under shallow equal', () => {
  const effect = vi.fn();
  let object = { a: 'a', b: { c: 'c' } };

  const { rerender } = renderHook(() => useCompareEffect(effect, [object], shallowEqual));

  expect(effect).toHaveBeenCalledOnce();

  act(() => {
    object = { a: 'a', b: { c: 'c' } };
    rerender();
  });

  expect(effect).toHaveBeenCalledTimes(2);
});

it('Should pass dep and prev dep to compare function in order', () => {
  const compare = vi.fn(() => true);
  const first = { id: 1 };
  const second = { id: 2 };
  let deps = [first];

  const { rerender } = renderHook(() => useCompareEffect(vi.fn(), deps, compare));

  expect(compare).not.toHaveBeenCalled();

  act(() => {
    deps = [second];
    rerender();
  });

  expect(compare).toHaveBeenCalledExactlyOnceWith(second, first);
});

it('Should use the compare function passed on the current render', () => {
  const effect = vi.fn();
  const user = { id: 1, name: 'John' };
  let compare = () => true;

  const { rerender } = renderHook(() => useCompareEffect(effect, [user], compare));

  expect(effect).toHaveBeenCalledOnce();

  act(rerender);

  expect(effect).toHaveBeenCalledOnce();

  act(() => {
    compare = () => false;
    rerender();
  });

  expect(effect).toHaveBeenCalledTimes(2);
});

it('Should not run effect when compare function returns true', () => {
  const effect = vi.fn();

  const { rerender } = renderHook(() => useCompareEffect(effect, [{ id: 1 }], () => true));

  expect(effect).toHaveBeenCalledOnce();

  act(rerender);

  expect(effect).toHaveBeenCalledOnce();
});

it('Should cleanup and rerun effect when compare function returns false', () => {
  const cleanup = vi.fn();
  const effect = vi.fn(() => cleanup);

  const { rerender } = renderHook(() => useCompareEffect(effect, [{ id: 1 }], () => false));

  expect(effect).toHaveBeenCalledOnce();
  expect(cleanup).not.toHaveBeenCalled();

  act(rerender);

  expect(cleanup).toHaveBeenCalledOnce();
  expect(effect).toHaveBeenCalledTimes(2);
});

it('Should allow deps length to change between renders', () => {
  const effect = vi.fn();
  let deps: unknown[] = [{ id: 1 }];

  const { rerender } = renderHook(() => useCompareEffect(effect, deps));

  act(() => {
    deps = [{ id: 1 }, { id: 2 }];
    rerender();
  });

  expect(effect).toHaveBeenCalledTimes(2);
});

it('Should run cleanup on unmount', () => {
  const cleanup = vi.fn();

  const { unmount } = renderHook(() => useCompareEffect(() => cleanup, [{ id: 1 }]));

  expect(cleanup).not.toHaveBeenCalled();

  unmount();

  expect(cleanup).toHaveBeenCalledOnce();
});

it('Should run effect on every render when deps are not passed', () => {
  const effect = vi.fn();

  const { rerender } = renderHook(() => useCompareEffect(effect));

  expect(effect).toHaveBeenCalledOnce();

  act(rerender);

  expect(effect).toHaveBeenCalledTimes(2);
});
