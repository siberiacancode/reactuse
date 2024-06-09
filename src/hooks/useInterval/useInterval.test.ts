import { act, renderHook, waitFor } from '@testing-library/react';

import { useInterval } from './useInterval';

it('Should be started by default', () => {
  const { result } = renderHook(() => useInterval(() => {}, 1000));

  expect(result.current.isActive).toBe(true);
});

it('Should pause and resume properly', () => {
  const { result } = renderHook(() => useInterval(() => {}, 1000));
  const { isActive, pause, resume } = result.current;

  expect(isActive).toBe(true);
  act(pause);
  waitFor(() => expect(isActive).toBe(false));
  act(resume);
  waitFor(() => expect(isActive).toBe(true));
});

it('Should not be active at initial render', () => {
  const { result } = renderHook(() => useInterval(() => {}, 1000, { immediate: false }));

  expect(result.current.isActive).toBe(false);
});

it('Should call the interval function immediately after resuming interval', () => {
  const { result } = renderHook(() =>
    useInterval(
      () => {
        document.title = 'useInterval test';
      },
      1000,
      {
        immediate: false,
        immediateCallback: true
      }
    )
  );

  act(result.current.resume);
  expect(document.title).toBe('useInterval test');
});
