import { act, renderHook } from '@testing-library/react';

import { useEvent } from './useEvent';

describe('useEvent', () => {
  test('should call the callback with the correct parameters', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useEvent(callback));

    act(() => {
      result.current('param1', 'param2');
    });

    expect(callback).toHaveBeenCalledWith('param1', 'param2');
  });

  test('should correctly bind this', () => {
    const callback = jest.fn(function (this: { a: number }, b: number) {
      return this.a + b;
    });

    const { result } = renderHook(() => useEvent(callback));

    const thisArg = { a: 5 };
    const arg = 7;

    act(() => {
      result.current.call(thisArg, arg);
    });

    expect(callback).toHaveBeenCalledWith(arg);
    expect(callback.mock.instances[0]).toBe(thisArg);
    expect(callback.mock.results[0].value).toBe(12);
  });

  test('should return the same function instance across renders', () => {
    const callback = jest.fn();
    const { result, rerender } = renderHook(() => useEvent(callback));

    const firstRenderResult = result.current;

    rerender();

    expect(result.current).toBe(firstRenderResult);
  });
});
