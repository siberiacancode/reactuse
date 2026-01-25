import { act, renderHook } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';

import type { SpriteMap } from './useAudio';

import { useAudio } from './useAudio';

const trigger = createTrigger<string, (event: MessageEvent) => void>();
const mockAudioPlay = vi.fn();
const mockAudioPause = vi.fn();
const mockAudioRemove = vi.fn();
const mockAudioRemoveEventListener = vi.fn();
const mockAudioAddEventListener = vi.fn();

class MockAudio {
  play = mockAudioPlay;
  pause = mockAudioPause;
  remove = mockAudioRemove;
  addEventListener = (type: string, callback: (event: MessageEvent) => void) => {
    mockAudioAddEventListener(type, callback);
    trigger.add(type, callback);
  };
  removeEventListener = (type: string, callback: (event: MessageEvent) => void) => {
    mockAudioRemoveEventListener(type, callback);
    if (trigger.get(type) === callback) trigger.delete(type);
  };
  volume = 0;
  playbackRate = 0;
  currentTime = 0;
}

afterEach(vi.clearAllMocks);

globalThis.Audio = MockAudio as unknown as typeof Audio;

it('Should use audio', () => {
  const { result } = renderHook(() => useAudio('audio.mp3'));

  expect(result.current.playing).toBeFalsy();
  expect(result.current.volume).toBe(1);
  expect(result.current.playbackRate).toBe(1);
  expect(result.current.play).toBeTypeOf('function');
  expect(result.current.pause).toBeTypeOf('function');
  expect(result.current.stop).toBeTypeOf('function');
  expect(result.current.setVolume).toBeTypeOf('function');
  expect(result.current.changePlaybackRate).toBeTypeOf('function');
});

it('Should use audio on server side', () => {
  const { result } = renderHookServer(() => useAudio('audio.mp3'));

  expect(result.current.playing).toBeFalsy();
  expect(result.current.volume).toBe(1);
  expect(result.current.playbackRate).toBe(1);
  expect(result.current.play).toBeTypeOf('function');
  expect(result.current.pause).toBeTypeOf('function');
  expect(result.current.stop).toBeTypeOf('function');
  expect(result.current.setVolume).toBeTypeOf('function');
  expect(result.current.changePlaybackRate).toBeTypeOf('function');
});

it('Should initialize with custom options', () => {
  const options = {
    volume: 0.5,
    playbackRate: 1.5,
    interrupt: true
  };

  const { result } = renderHook(() => useAudio('audio.mp3', options));

  expect(result.current.volume).toBe(0.5);
  expect(result.current.playbackRate).toBe(1.5);
});

it('Should play immediately', () => {
  const { result } = renderHook(() => useAudio('audio.mp3', { immediately: true }));

  expect(result.current.playing).toBeTruthy();

  expect(mockAudioPlay).toHaveBeenCalledTimes(1);
});

it('Should play audio', async () => {
  const { result } = renderHook(() => useAudio('audio.mp3'));

  await act(result.current.play);

  expect(mockAudioPlay).toHaveBeenCalledTimes(1);
});

it('Should pause audio', async () => {
  const { result } = renderHook(() =>
    useAudio('audio.mp3', {
      immediately: true
    })
  );

  expect(result.current.playing).toBeTruthy();

  await act(result.current.pause);

  expect(result.current.playing).toBeFalsy();
  expect(mockAudioPause).toHaveBeenCalledTimes(1);
});

it('Should stop audio', async () => {
  const { result } = renderHook(() =>
    useAudio('audio.mp3', {
      immediately: true
    })
  );

  expect(result.current.playing).toBeTruthy();

  await act(result.current.stop);

  expect(result.current.playing).toBeFalsy();
  expect(mockAudioPause).toHaveBeenCalledTimes(1);
});

it('Should set volume', async () => {
  const { result } = renderHook(() => useAudio('audio.mp3'));

  act(() => result.current.setVolume(0.7));

  expect(result.current.volume).toBe(0.7);
});

it('Should clamp volume between 0 and 1', () => {
  const { result } = renderHook(() => useAudio('audio.mp3'));

  act(() => result.current.setVolume(1.5));
  expect(result.current.volume).toBe(1);

  act(() => result.current.setVolume(-0.5));
  expect(result.current.volume).toBe(0);
});

it('Should change playback rate', () => {
  const { result } = renderHook(() => useAudio('audio.mp3'));

  act(() => result.current.changePlaybackRate(1.25));

  expect(result.current.playbackRate).toBe(1.25);
});

it('Should clamp playback rate between 0.5 and 2', () => {
  const { result } = renderHook(() => useAudio('audio.mp3'));

  act(() => result.current.changePlaybackRate(3));
  expect(result.current.playbackRate).toBe(2);

  act(() => result.current.changePlaybackRate(0.25));
  expect(result.current.playbackRate).toBe(0.5);
});

it('Should handle sprite playback', async () => {
  const sprite = {
    intro: [0, 5],
    loop: [5, 15]
  } as SpriteMap;

  const { result } = renderHook(() => useAudio('audio.mp3', { sprite }));

  await act(async () => {
    await result.current.play('intro');
  });

  expect(mockAudioPlay).toHaveBeenCalledTimes(1);
});

it('Should recreate audio element when src changes', () => {
  const { rerender } = renderHook((src) => useAudio(src, { immediately: true }), {
    initialProps: 'audio.mp3'
  });

  expect(mockAudioPlay).toHaveBeenCalledTimes(1);

  rerender('new-audio.mp3');

  expect(mockAudioPlay).toHaveBeenCalledTimes(2);
});

it('Should cleanup audio element on unmount', () => {
  const { unmount } = renderHook(() => useAudio('audio.mp3'));

  unmount();

  expect(mockAudioRemoveEventListener).toHaveBeenCalledWith('play', expect.any(Function));
  expect(mockAudioRemoveEventListener).toHaveBeenCalledWith('pause', expect.any(Function));
  expect(mockAudioRemoveEventListener).toHaveBeenCalledWith('ended', expect.any(Function));
  expect(mockAudioRemoveEventListener).toHaveBeenCalledWith('volumechange', expect.any(Function));
  expect(mockAudioRemoveEventListener).toHaveBeenCalledWith('ratechange', expect.any(Function));
  expect(mockAudioPause).toHaveBeenCalled();
  expect(mockAudioRemove).toHaveBeenCalled();
});
