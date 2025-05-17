import { renderHook } from '@testing-library/react';

import { useRenderInfo } from './useRenderInfo';

vi.useFakeTimers().setSystemTime(new Date('1999-03-12'));
it('Should use render info', () => {
  const { result } = renderHook(() => useRenderInfo('Component'));

  expect(result.current.component).toBe('Component');
  expect(result.current.renders).toBe(1);
  expect(result.current.timestamp).toBe(921196800000);
  expect(result.current.sinceLast).toBe(0);
});

it('Should increment renders on subsequent calls', async () => {
  const { result, rerender } = renderHook(() => useRenderInfo('Component'));

  expect(result.current.renders).toBe(1);
  expect(result.current.timestamp).toBe(921196800000);
  expect(result.current.sinceLast).toBe(0);

  await vi.advanceTimersByTimeAsync(1);
  rerender();

  expect(result.current.renders).toBe(2);
  expect(result.current.timestamp).toBe(921196800001);
  expect(result.current.sinceLast).toBe(1);
});

it('Should log render information when log is true', () => {
  console.log = vi.fn();
  renderHook(() => useRenderInfo('TComponent', true));

  expect(console.log).toHaveBeenCalled();
});

it('Should not log render information when log is false', () => {
  console.log = vi.fn();
  renderHook(() => useRenderInfo('Component', false));

  expect(console.log).not.toHaveBeenCalled();
});
