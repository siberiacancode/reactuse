import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, expect, vi } from 'vitest';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

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

const targets = [
  undefined,
  target('#target'),
  target(document.getElementById('target')!),
  target(() => document.getElementById('target')!),
  { current: document.getElementById('target') },
  Object.assign(() => {}, {
    state: document.getElementById('target'),
    current: document.getElementById('target')
  })
];

const element = document.getElementById('target') as HTMLVideoElement;

targets.forEach((target) => {
  it('Should use display media', () => {
    const { result } = renderHook(() => {
      if (target)
        return useDisplayMedia(target) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseDisplayMediaReturn;
      return useDisplayMedia<HTMLVideoElement>();
    });

    expect(result.current.active).toBeFalsy();
    expect(result.current.stream).toBeNull();
    expect(result.current.supported).toBeTruthy();
    expect(result.current.start).toBeTypeOf('function');
    expect(result.current.stop).toBeTypeOf('function');
    if (!target) expect(result.current.ref).toBeTypeOf('function');
    if (target) expect(result.current.ref).toBeUndefined();
  });

  it('Should use display media on server side', () => {
    const { result } = renderHookServer(() => {
      if (target)
        return useDisplayMedia(target) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseDisplayMediaReturn;
      return useDisplayMedia<HTMLVideoElement>();
    });

    expect(result.current.active).toBeFalsy();
    expect(result.current.stream).toBeNull();
    expect(result.current.supported).toBeFalsy();
    expect(result.current.start).toBeTypeOf('function');
    expect(result.current.stop).toBeTypeOf('function');
    if (!target) expect(result.current.ref).toBeTypeOf('function');
    if (target) expect(result.current.ref).toBeUndefined();
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

    expect(result.current.active).toBeFalsy();
    expect(result.current.stream).toBeNull();
    expect(result.current.supported).toBeFalsy();
    expect(result.current.start).toBeTypeOf('function');
    expect(result.current.stop).toBeTypeOf('function');
    if (!target) expect(result.current.ref).toBeTypeOf('function');
    if (target) expect(result.current.ref).toBeUndefined();
  });

  it('Should start display media', async () => {
    const constraints = {
      audio: false,
      video: false
    };

    const { result } = renderHook(() => {
      if (target)
        return useDisplayMedia(target) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseDisplayMediaReturn;
      return useDisplayMedia<HTMLVideoElement>();
    });

    if (!target)
      act(() => result.current.ref(document.getElementById('target')! as HTMLVideoElement));

    await act(() => result.current.start(constraints));

    expect(element.srcObject).toBeTruthy();
    expect(result.current.active).toBeTruthy();
    expect(result.current.stream).toBeTruthy();
    expect(mockGetDisplayMedia).toHaveBeenCalledWith(constraints);
  });

  it('Should stop display media', async () => {
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

    await act(result.current.stop);

    expect(mockTrack.stop).toHaveBeenCalledOnce();
    expect(result.current.active).toBeFalsy();
    expect(result.current.stream).toBeNull();
  });

  it('Should start immediately', async () => {
    const { result } = renderHook(() => {
      if (target)
        return useDisplayMedia(target, { immediately: true }) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseDisplayMediaReturn;
      return useDisplayMedia<HTMLVideoElement>({ immediately: true });
    });

    if (!target)
      act(() => result.current.ref(document.getElementById('target')! as HTMLVideoElement));

    await waitFor(() => expect(mockGetDisplayMedia).toHaveBeenCalledOnce());
    await waitFor(() => expect(result.current.active).toBeTruthy());
  });

  it('Should call onStart', async () => {
    const onStart = vi.fn();
    const { result } = renderHook(() => {
      if (target)
        return useDisplayMedia(target, { onStart }) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseDisplayMediaReturn;
      return useDisplayMedia<HTMLVideoElement>({ onStart });
    });

    if (!target)
      act(() => result.current.ref(document.getElementById('target')! as HTMLVideoElement));

    await act(result.current.start);

    expect(onStart).toHaveBeenCalledOnce();
    expect(onStart).toHaveBeenCalledWith(result.current.stream);
  });

  it('Should call onStop', async () => {
    const onStop = vi.fn();
    const { result } = renderHook(() => {
      if (target)
        return useDisplayMedia(target, { onStop }) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseDisplayMediaReturn;
      return useDisplayMedia<HTMLVideoElement>({ onStop });
    });

    if (!target)
      act(() => result.current.ref(document.getElementById('target')! as HTMLVideoElement));

    await act(result.current.start);
    const stream = result.current.stream;

    await act(result.current.stop);

    expect(onStop).toHaveBeenCalledOnce();
    expect(onStop).toHaveBeenCalledWith(stream);
  });

  it('Should handle target changes', () => {
    const { result, rerender } = renderHook(
      (target) => {
        if (target)
          return useDisplayMedia(target) as {
            ref: StateRef<HTMLVideoElement>;
          } & UseDisplayMediaReturn;
        return useDisplayMedia<HTMLVideoElement>();
      },
      { initialProps: target }
    );

    if (!target) act(() => result.current.ref(element));

    expect(result.current.active).toBeFalsy();

    rerender({ current: document.getElementById('target') });

    expect(result.current.active).toBeFalsy();
  });

  it('Should cleanup on unmount', async () => {
    const { result, unmount } = renderHook(() => {
      if (target)
        return useDisplayMedia(target, { immediately: true }) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseDisplayMediaReturn;
      return useDisplayMedia<HTMLVideoElement>({ immediately: true });
    });

    if (!target) act(() => result.current.ref(element));

    await act(result.current.start);

    expect(result.current.active).toBeTruthy();
    expect(result.current.stream).toBeTruthy();

    unmount();

    await waitFor(() => expect(mockTrack.stop).toHaveBeenCalledOnce());
  });
});
