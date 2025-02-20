import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, vi } from 'vitest';

import { renderHookServer } from '@/tests';
import { getElement } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseDisplayMediaReturn } from './useDisplayMedia';

import { useDisplayMedia } from './useDisplayMedia';

const mockGetDisplayMedia = vi.fn();
const mockTrack = {
  stop: vi.fn(),
  onended: vi.fn()
};

beforeEach(() => {
  Object.assign(navigator, {
    mediaDevices: {
      getDisplayMedia: mockGetDisplayMedia
    }
  });

  mockGetDisplayMedia.mockResolvedValue({
    getTracks: () => [mockTrack]
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

const targets = [
  undefined,
  '#target',
  document.getElementById('target') as HTMLVideoElement,
  { current: document.getElementById('target') as HTMLVideoElement }
];

targets.forEach((target) => {
  beforeEach(mockGetDisplayMedia.mockClear);

  it('Should use display media', () => {
    const { result } = renderHook(() => {
      if (target)
        return useDisplayMedia(target) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseDisplayMediaReturn;
      return useDisplayMedia<HTMLVideoElement>();
    });

    expect(result.current.sharing).toBe(false);
    expect(result.current.stream).toBeNull();
    expect(result.current.supported).toBe(true);
    expect(result.current.start).toBeTypeOf('function');
    expect(result.current.stop).toBeTypeOf('function');
    if (!target) expect(result.current.ref).toBeTypeOf('function');
  });

  it('Should use display media on server', () => {
    const { result } = renderHookServer(() => {
      if (target)
        return useDisplayMedia(target) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseDisplayMediaReturn;
      return useDisplayMedia<HTMLVideoElement>();
    });

    expect(result.current.sharing).toBe(false);
    expect(result.current.stream).toBeNull();
    expect(result.current.supported).toBe(false);
    expect(result.current.start).toBeTypeOf('function');
    expect(result.current.stop).toBeTypeOf('function');
    if (!target) expect(result.current.ref).toBeTypeOf('function');
  });

  it('Should use display media for unsupported', () => {
    Object.assign(navigator, {
      mediaDevices: undefined
    });

    const { result } = renderHook(() => {
      if (target)
        return useDisplayMedia(target) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseDisplayMediaReturn;
      return useDisplayMedia<HTMLVideoElement>();
    });

    expect(result.current.sharing).toBe(false);
    expect(result.current.stream).toBeNull();
    expect(result.current.supported).toBe(false);
    expect(result.current.start).toBeTypeOf('function');
    expect(result.current.stop).toBeTypeOf('function');
    if (!target) expect(result.current.ref).toBeTypeOf('function');
  });

  it('Should be able to start and stop sharing', async () => {
    const { result } = renderHook(() => {
      if (target)
        return useDisplayMedia(target) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseDisplayMediaReturn;
      return useDisplayMedia<HTMLVideoElement>();
    });

    if (!target)
      act(() => result.current.ref(document.getElementById('target')! as HTMLVideoElement));

    await act(result.current.start);

    const element = (target ? getElement(target) : result.current.ref.current) as HTMLVideoElement;
    expect(element.srcObject).toBeTruthy();
    expect(result.current.sharing).toBe(true);
    expect(result.current.stream).toBeTruthy();

    await act(result.current.stop);

    expect(mockTrack.stop).toHaveBeenCalled();
    expect(result.current.sharing).toBe(false);
    expect(result.current.stream).toBeNull();
  });

  it('Should start immediately when immediate option is true', async () => {
    const { result } = renderHook(() => {
      if (target)
        return useDisplayMedia(target, { enabled: true }) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseDisplayMediaReturn;
      return useDisplayMedia<HTMLVideoElement>({ enabled: true });
    });

    if (!target)
      act(() => result.current.ref(document.getElementById('target')! as HTMLVideoElement));

    await waitFor(() => expect(mockGetDisplayMedia).toHaveBeenCalled());
    await waitFor(() => expect(result.current.sharing).toBe(true));
  });

  it('Should accept boolean audio and video constraints', async () => {
    const { result } = renderHook(() => {
      if (target)
        return useDisplayMedia(target, { audio: false, video: false }) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseDisplayMediaReturn;
      return useDisplayMedia<HTMLVideoElement>({ audio: false, video: false });
    });

    if (!target)
      act(() => result.current.ref(document.getElementById('target')! as HTMLVideoElement));

    await act(result.current.start);

    expect(mockGetDisplayMedia).toHaveBeenCalledWith({
      audio: false,
      video: false
    });
  });
});
