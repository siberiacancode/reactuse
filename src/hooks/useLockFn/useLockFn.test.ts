import type { MutableRefObject } from 'react';
import { useCallback, useRef, useState } from 'react';
import type { RenderHookResult } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react';

import { useLockFn } from '@/hooks/useLockFn/useLockFn';

type HookReturnType = {
  locked: (step: number) => Promise<void | undefined>;
  countRef: MutableRefObject<number>;
  updateTag: () => void;
};

const sleep = (time: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, time);
  });

describe('useLockFn', () => {
  const setUp = (): RenderHookResult<HookReturnType, void> =>
    renderHook<HookReturnType, void>(() => {
      const [tag, updateTag] = useState(false);
      const countRef = useRef(0);
      const persistFn = useCallback(
        async (step: number) => {
          countRef.current += step;
          await sleep(50);
        },
        [tag]
      );
      const locked = useLockFn(persistFn);

      return {
        locked,
        countRef,
        updateTag: () => updateTag(true)
      };
    });

  it('should work', async () => {
    const hook = setUp();
    const { locked, countRef } = hook.result.current;
    act(() => {
      locked(1);
    });
    expect(countRef.current).toBe(1);
    act(() => {
      locked(2);
    });
    expect(countRef.current).toBe(1);
    await sleep(30);
    act(() => {
      locked(3);
    });
    expect(countRef.current).toBe(1);
    await sleep(30);
    act(() => {
      locked(4);
    });
    expect(countRef.current).toBe(5);
    act(() => {
      locked(5);
    });
    expect(countRef.current).toBe(5);
  });

  it('should same', () => {
    const hook = setUp();
    const preLocked = hook.result.current.locked;
    hook.rerender();
    expect(hook.result.current.locked).toEqual(preLocked);
    act(hook.result.current.updateTag);
    expect(hook.result.current.locked).not.toEqual(preLocked);
  });
});
