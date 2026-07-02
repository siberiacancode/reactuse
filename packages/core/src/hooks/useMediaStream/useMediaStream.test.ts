import { act, renderHook, waitFor } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseMediaStreamReturn } from './useMediaStream';

import { useMediaStream } from './useMediaStream';

const video = document.createElement('video');
video.id = 'media-stream-target';
document.body.appendChild(video);

const element = document.getElementById('media-stream-target') as HTMLVideoElement;

const mockGetUserMedia = vi.fn();

let mockVideoTrack = {
  stop: vi.fn(),
  onended: null as (() => void) | null,
  applyConstraints: vi.fn()
};
let mockAudioTrack = {
  stop: vi.fn(),
  onended: null as (() => void) | null,
  applyConstraints: vi.fn()
};
let mockStream = {
  getTracks: () => [mockVideoTrack, mockAudioTrack],
  getVideoTracks: () => [mockVideoTrack],
  getAudioTracks: () => [mockAudioTrack]
};

const targets = [
  undefined,
  target('#media-stream-target'),
  target(document.getElementById('media-stream-target')!),
  target(() => document.getElementById('media-stream-target')!),
  { current: document.getElementById('media-stream-target') },
  Object.assign(() => {}, {
    state: document.getElementById('media-stream-target'),
    current: document.getElementById('media-stream-target')
  })
];

beforeEach(() => {
  Object.defineProperty(element, 'srcObject', {
    value: null,
    writable: true,
    configurable: true
  });

  mockVideoTrack = {
    stop: vi.fn(),
    onended: null,
    applyConstraints: vi.fn().mockResolvedValue(undefined)
  };

  mockAudioTrack = {
    stop: vi.fn(),
    onended: null,
    applyConstraints: vi.fn().mockResolvedValue(undefined)
  };

  mockStream = {
    getTracks: () => [mockVideoTrack, mockAudioTrack],
    getVideoTracks: () => [mockVideoTrack],
    getAudioTracks: () => [mockAudioTrack]
  };

  Object.assign(navigator, {
    mediaDevices: {
      getUserMedia: mockGetUserMedia
    }
  });

  mockGetUserMedia.mockResolvedValue(mockStream);
});

targets.forEach((target) => {
  it('Should use media stream', () => {
    const { result } = renderHook(() => {
      if (target)
        return useMediaStream(target) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseMediaStreamReturn;
      return useMediaStream();
    });

    expect(result.current.active).toBeFalsy();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.stream).toBeUndefined();
    expect(result.current.supported).toBeTruthy();
    expect(result.current.start).toBeTypeOf('function');
    expect(result.current.apply).toBeTypeOf('function');
    expect(result.current.stop).toBeTypeOf('function');
    expect(result.current.restart).toBeTypeOf('function');
    if (!target) expect(result.current.ref).toBeTypeOf('function');
    if (target) expect(result.current.ref).toBeUndefined();
  });

  it('Should use media stream on server side', () => {
    const { result } = renderHookServer(() => {
      if (target)
        return useMediaStream(target) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseMediaStreamReturn;
      return useMediaStream();
    });

    expect(result.current.active).toBeFalsy();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.stream).toBeUndefined();
    expect(result.current.supported).toBeFalsy();
    expect(result.current.start).toBeTypeOf('function');
    expect(result.current.apply).toBeTypeOf('function');
    expect(result.current.stop).toBeTypeOf('function');
    expect(result.current.restart).toBeTypeOf('function');
    if (!target) expect(result.current.ref).toBeTypeOf('function');
    if (target) expect(result.current.ref).toBeUndefined();
  });

  it('Should use media stream for unsupported', () => {
    Object.assign(navigator, {
      mediaDevices: undefined
    });

    const { result } = renderHook(() => {
      if (target)
        return useMediaStream(target) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseMediaStreamReturn;
      return useMediaStream();
    });

    expect(result.current.active).toBeFalsy();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.stream).toBeUndefined();
    expect(result.current.supported).toBeFalsy();
    expect(result.current.start).toBeTypeOf('function');
    expect(result.current.apply).toBeTypeOf('function');
    expect(result.current.stop).toBeTypeOf('function');
    expect(result.current.restart).toBeTypeOf('function');
    if (!target) expect(result.current.ref).toBeTypeOf('function');
    if (target) expect(result.current.ref).toBeUndefined();
  });

  it('Should start stream', async () => {
    const { result } = renderHook(() => {
      if (target)
        return useMediaStream(target) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseMediaStreamReturn;
      return useMediaStream();
    });

    if (!target) act(() => result.current.ref(element));

    await act(result.current.start);

    expect(element.srcObject).toBe(mockStream);
    expect(result.current.active).toBeTruthy();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.stream).toBe(mockStream);
    expect(mockGetUserMedia).toHaveBeenCalledWith({
      audio: true,
      video: true
    });
  });

  it('Should stop stream', async () => {
    const { result } = renderHook(() => {
      if (target)
        return useMediaStream(target) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseMediaStreamReturn;
      return useMediaStream();
    });

    if (!target) act(() => result.current.ref(element));

    await act(result.current.start);

    act(() => result.current.stop());

    expect(element.srcObject).toBeNull();
    expect(result.current.active).toBeFalsy();
    expect(result.current.stream).toBeUndefined();
    expect(mockVideoTrack.stop).toHaveBeenCalledOnce();
    expect(mockAudioTrack.stop).toHaveBeenCalledOnce();
  });

  it('Should start immediately', async () => {
    const { result } = renderHook(() => {
      if (target)
        return useMediaStream(target, { immediately: true }) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseMediaStreamReturn;
      return useMediaStream({ immediately: true });
    });

    if (!target) act(() => result.current.ref(element));

    await waitFor(() => expect(mockGetUserMedia).toHaveBeenCalledOnce());
    await waitFor(() => expect(result.current.stream).toBe(mockStream));

    expect(result.current.active).toBeTruthy();
    expect(result.current.loading).toBeFalsy();
  });

  it('Should call onStart callback', async () => {
    const onStart = vi.fn();

    const { result } = renderHook(() => {
      if (target)
        return useMediaStream(target, { onStart }) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseMediaStreamReturn;
      return useMediaStream({ onStart });
    });

    if (!target) act(() => result.current.ref(element));

    await act(result.current.start);

    expect(onStart).toHaveBeenCalledWith(mockStream);
  });

  it('Should call onStop callback when stream stops', async () => {
    const onStop = vi.fn();

    const { result } = renderHook(() => {
      if (target)
        return useMediaStream(target, { onStop }) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseMediaStreamReturn;
      return useMediaStream({ onStop });
    });

    if (!target) act(() => result.current.ref(element));

    await act(result.current.start);
    act(() => result.current.stop());

    expect(onStop).toHaveBeenCalledWith(mockStream);
  });

  it('Should apply constraints to active stream', async () => {
    const { result } = renderHook(() => {
      if (target)
        return useMediaStream(target) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseMediaStreamReturn;
      return useMediaStream();
    });

    if (!target) act(() => result.current.ref(element));

    await act(result.current.start);

    await act(async () => {
      await result.current.apply({
        video: { width: 1280 },
        audio: { echoCancellation: true }
      });
    });

    expect(mockVideoTrack.applyConstraints).toHaveBeenCalledWith({ width: 1280 });
    expect(mockAudioTrack.applyConstraints).toHaveBeenCalledWith({
      echoCancellation: true
    });
  });

  it('Should restart stream', async () => {
    const constraints = {
      video: { width: 640 },
      audio: false
    } satisfies MediaStreamConstraints;

    const { result } = renderHook(() => {
      if (target)
        return useMediaStream(target) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseMediaStreamReturn;
      return useMediaStream();
    });

    if (!target) act(() => result.current.ref(element));

    await act(async () => {
      await result.current.start(constraints);
    });
    expect(mockGetUserMedia).toHaveBeenCalledWith(constraints);

    await act(result.current.restart);

    expect(mockGetUserMedia).toHaveBeenCalledWith(constraints);
    expect(mockVideoTrack.stop).toHaveBeenCalled();
    expect(mockAudioTrack.stop).toHaveBeenCalled();
    expect(result.current.stream).toBe(mockStream);
  });

  it('Should call onError callback', async () => {
    const onError = vi.fn();
    const error = new Error('Permission denied');
    mockGetUserMedia.mockRejectedValueOnce(error);

    const { result } = renderHook(() => {
      if (target)
        return useMediaStream(target, { onError }) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseMediaStreamReturn;
      return useMediaStream({ onError });
    });

    if (!target) act(() => result.current.ref(element));

    await act(result.current.start);

    expect(result.current.active).toBeFalsy();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.stream).toBeUndefined();
    expect(onError).toHaveBeenCalledWith(error);
  });

  it('Should stop stream when track ends', async () => {
    const { result } = renderHook(() => {
      if (target)
        return useMediaStream(target) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseMediaStreamReturn;
      return useMediaStream();
    });

    if (!target) act(() => result.current.ref(element));

    await act(result.current.start);

    act(() => mockVideoTrack.onended!());

    expect(element.srcObject).toBeNull();
    expect(result.current.active).toBeFalsy();
    expect(result.current.stream).toBeUndefined();
    expect(mockVideoTrack.stop).toHaveBeenCalledOnce();
    expect(mockAudioTrack.stop).toHaveBeenCalledOnce();
  });

  it('Should cleanup on unmount', async () => {
    const { result, unmount } = renderHook(() => {
      if (target)
        return useMediaStream(target, { immediately: true }) as {
          ref: StateRef<HTMLVideoElement>;
        } & UseMediaStreamReturn;
      return useMediaStream({ immediately: true });
    });

    if (!target) act(() => result.current.ref(element));

    await waitFor(() => expect(result.current.stream).toBe(mockStream));

    unmount();

    expect(mockVideoTrack.stop).toHaveBeenCalledOnce();
    expect(mockAudioTrack.stop).toHaveBeenCalledOnce();
  });
});
