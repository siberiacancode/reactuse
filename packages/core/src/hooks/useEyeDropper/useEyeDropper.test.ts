import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { renderHookServer } from '@/tests';

import { useEyeDropper } from './useEyeDropper';

const mockEyeDropperOpen = vi.fn();

class MockEyeDropper {
  open = mockEyeDropperOpen;
}

beforeEach(() => {
  Object.assign(globalThis.window, {
    EyeDropper: MockEyeDropper
  });
});

afterEach(vi.clearAllMocks);

it('Should use eye dropper', () => {
  const { result } = renderHook(useEyeDropper);

  expect(result.current.supported).toBeTruthy();
  expect(result.current.value).toBeUndefined();
  expect(result.current.open).toBeTypeOf('function');
});

it('Should use eye dropper on server side', () => {
  const { result } = renderHookServer(useEyeDropper);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.value).toBeUndefined();
  expect(result.current.open).toBeTypeOf('function');
});

it('Should use eye dropper for unsupported', () => {
  Object.assign(globalThis.window, {
    EyeDropper: undefined
  });

  const { result } = renderHook(useEyeDropper);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.value).toBeUndefined();
  expect(result.current.open).toBeTypeOf('function');
});

it('Should handle initialValue', () => {
  const { result } = renderHook(() => useEyeDropper('#ffffff'));

  expect(result.current.value).toBe('#ffffff');
});

it('Should handle open method', async () => {
  mockEyeDropperOpen.mockResolvedValue({ sRGBHex: '#ffffff' });

  const { result } = renderHook(useEyeDropper);

  expect(result.current.value).toBeUndefined();

  await act(result.current.open);

  expect(result.current.value).toBe('#ffffff');
  expect(mockEyeDropperOpen).toHaveBeenCalledTimes(1);
});
