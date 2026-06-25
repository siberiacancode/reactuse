import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderHookServer } from '@/tests';

import { useCycleList } from './useCycleList';

describe('useCycleList', () => {
  const tracks = ['AC/DC', 'Metallica', 'Nirvana'];

  it('returns first item by default', () => {
    const { result } = renderHook(() => useCycleList(tracks));

    expect(result.current.index).toBe(0);
    expect(result.current.value).toBe('AC/DC');
  });

  it('Should work on server side', () => {
    const { result } = renderHookServer(() => useCycleList(tracks));

    expect(result.current.index).toBe(0);
    expect(result.current.value).toBe('AC/DC');
  });

  it('uses defaultIndex as initial index', () => {
    const { result } = renderHook(() => useCycleList(tracks, { defaultIndex: 1 }));

    expect(result.current.index).toBe(1);
    expect(result.current.value).toBe('Metallica');
  });

  it('normalizes defaultIndex when loop is true', () => {
    const { result } = renderHook(() => useCycleList(tracks, { defaultIndex: -1 }));

    expect(result.current.index).toBe(2);
    expect(result.current.value).toBe('Nirvana');
  });

  it('clamps defaultIndex when loop is false', () => {
    const { result } = renderHook(() =>
      useCycleList(tracks, {
        defaultIndex: 99,
        loop: false
      })
    );

    expect(result.current.index).toBe(2);
    expect(result.current.value).toBe('Nirvana');
  });

  it('uses initialValue as initial index', () => {
    const { result } = renderHook(() => useCycleList(tracks, { initialValue: 'Metallica' }));

    expect(result.current.index).toBe(1);
    expect(result.current.value).toBe('Metallica');
  });

  it('uses strict equality for initialValue comparison', () => {
    const target = { id: 2, title: 'Metallica' };

    const list = [{ id: 1, title: 'AC/DC' }, target, { id: 3, title: 'Nirvana' }];

    const { result } = renderHook(() => useCycleList(list, { initialValue: target }));

    expect(result.current.index).toBe(1);
    expect(result.current.value).toBe(target);
  });

  it('falls back to first item when initialValue is not found', () => {
    const { result } = renderHook(() => useCycleList(tracks, { initialValue: 'Muse' }));

    expect(result.current.index).toBe(0);
    expect(result.current.value).toBe('AC/DC');
  });

  it('defaultIndex takes precedence over initialValue', () => {
    const { result } = renderHook(() =>
      useCycleList(tracks, {
        defaultIndex: 2,
        initialValue: 'AC/DC'
      })
    );

    expect(result.current.index).toBe(2);
    expect(result.current.value).toBe('Nirvana');
  });

  it('goes to next item', () => {
    const { result } = renderHook(() => useCycleList(tracks));

    act(() => {
      result.current.next();
    });

    expect(result.current.index).toBe(1);
    expect(result.current.value).toBe('Metallica');
  });

  it('goes to next item with custom step', () => {
    const { result } = renderHook(() => useCycleList(tracks));

    act(() => {
      result.current.next(2);
    });

    expect(result.current.index).toBe(2);
    expect(result.current.value).toBe('Nirvana');
  });

  it('cycles to start when next reaches the end and loop is true', () => {
    const { result } = renderHook(() => useCycleList(tracks, { defaultIndex: 2 }));

    act(() => {
      result.current.next();
    });

    expect(result.current.index).toBe(0);
    expect(result.current.value).toBe('AC/DC');
  });

  it('goes to previous item', () => {
    const { result } = renderHook(() => useCycleList(tracks, { defaultIndex: 1 }));

    act(() => {
      result.current.prev();
    });

    expect(result.current.index).toBe(0);
    expect(result.current.value).toBe('AC/DC');
  });

  it('cycles to end when prev reaches the start and loop is true', () => {
    const { result } = renderHook(() => useCycleList(tracks));

    act(() => {
      result.current.prev();
    });

    expect(result.current.index).toBe(2);
    expect(result.current.value).toBe('Nirvana');
  });

  it('supports negative step', () => {
    const { result } = renderHook(() => useCycleList(tracks));

    act(() => {
      result.current.next(-1);
    });

    expect(result.current.index).toBe(2);
    expect(result.current.value).toBe('Nirvana');

    act(() => {
      result.current.prev(-1);
    });

    expect(result.current.index).toBe(0);
    expect(result.current.value).toBe('AC/DC');
  });

  it('clamps next and prev when loop is false', () => {
    const { result } = renderHook(() =>
      useCycleList(tracks, {
        defaultIndex: 1,
        loop: false
      })
    );

    act(() => {
      result.current.next(99);
    });

    expect(result.current.index).toBe(2);
    expect(result.current.value).toBe('Nirvana');

    act(() => {
      result.current.next();
    });

    expect(result.current.index).toBe(2);
    expect(result.current.value).toBe('Nirvana');

    act(() => {
      result.current.prev(99);
    });

    expect(result.current.index).toBe(0);
    expect(result.current.value).toBe('AC/DC');

    act(() => {
      result.current.prev();
    });

    expect(result.current.index).toBe(0);
    expect(result.current.value).toBe('AC/DC');
  });

  it('goes to specific index', () => {
    const { result } = renderHook(() => useCycleList(tracks));

    act(() => {
      result.current.go(2);
    });

    expect(result.current.index).toBe(2);
    expect(result.current.value).toBe('Nirvana');
  });

  it('normalizes go index when loop is true', () => {
    const { result } = renderHook(() => useCycleList(tracks));

    act(() => {
      result.current.go(-1);
    });

    expect(result.current.index).toBe(2);
    expect(result.current.value).toBe('Nirvana');

    act(() => {
      result.current.go(3);
    });

    expect(result.current.index).toBe(0);
    expect(result.current.value).toBe('AC/DC');
  });

  it('clamps go index when loop is false', () => {
    const { result } = renderHook(() => useCycleList(tracks, { loop: false }));

    act(() => {
      result.current.go(-1);
    });

    expect(result.current.index).toBe(0);
    expect(result.current.value).toBe('AC/DC');

    act(() => {
      result.current.go(99);
    });

    expect(result.current.index).toBe(2);
    expect(result.current.value).toBe('Nirvana');
  });

  it('ignores invalid step and index values', () => {
    const { result } = renderHook(() => useCycleList(tracks));

    act(() => {
      result.current.next(Number.NaN);
    });

    expect(result.current.index).toBe(0);
    expect(result.current.value).toBe('AC/DC');

    act(() => {
      result.current.prev(Number.POSITIVE_INFINITY);
    });

    expect(result.current.index).toBe(0);
    expect(result.current.value).toBe('AC/DC');

    act(() => {
      result.current.go(1.5);
    });

    expect(result.current.index).toBe(0);
    expect(result.current.value).toBe('AC/DC');
  });

  it('returns index 0 and undefined value for empty list', () => {
    const { result } = renderHook(() => useCycleList<string>([]));

    expect(result.current.index).toBe(0);
    expect(result.current.value).toBeUndefined();
  });

  it('does nothing when list is empty', () => {
    const { result } = renderHook(() => useCycleList<string>([]));

    act(() => {
      result.current.next();
      result.current.prev();
      result.current.go(10);
    });

    expect(result.current.index).toBe(0);
    expect(result.current.value).toBeUndefined();
  });

  it('keeps index safe when list length decreases', () => {
    const { result, rerender } = renderHook(({ list }) => useCycleList(list, { defaultIndex: 3 }), {
      initialProps: {
        list: ['AC/DC', 'Metallica', 'Nirvana', 'Muse']
      }
    });

    expect(result.current.index).toBe(3);
    expect(result.current.value).toBe('Muse');

    rerender({
      list: ['AC/DC', 'Metallica']
    });

    expect(result.current.index).toBe(1);
    expect(result.current.value).toBe('Metallica');
  });

  it('does not recalculate initial index when defaultIndex changes after mount', () => {
    const { result, rerender } = renderHook(
      ({ defaultIndex }) => useCycleList(tracks, { defaultIndex }),
      {
        initialProps: {
          defaultIndex: 0
        }
      }
    );

    expect(result.current.index).toBe(0);
    expect(result.current.value).toBe('AC/DC');

    rerender({
      defaultIndex: 2
    });

    expect(result.current.index).toBe(0);
    expect(result.current.value).toBe('AC/DC');
  });

  it('does not recalculate initial index when initialValue changes after mount', () => {
    const { result, rerender } = renderHook(
      ({ initialValue }) => useCycleList(tracks, { initialValue }),
      {
        initialProps: {
          initialValue: 'AC/DC'
        }
      }
    );

    expect(result.current.index).toBe(0);
    expect(result.current.value).toBe('AC/DC');

    rerender({
      initialValue: 'Nirvana'
    });

    expect(result.current.index).toBe(0);
    expect(result.current.value).toBe('AC/DC');
  });
});
