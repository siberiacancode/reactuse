import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import type { SpriteMap } from './useAudio';

import { useAudio } from './useAudio';

const mockAudioPlay = vi.fn();
const mockAudioPause = vi.fn();
const mockAudioRemove = vi.fn();
const mockAudioRemoveEventListener = vi.fn();
const mockAudioAddEventListener = vi.fn();

class MockAudio extends EventTarget {
  static instances: MockAudio[] = [];

  src: string;
  play = mockAudioPlay;
  pause = mockAudioPause;
  remove = mockAudioRemove;
  volume = 0;
  playbackRate = 0;
  currentTime = 0;

  constructor(src: string) {
    super();
    this.src = src;
    MockAudio.instances.push(this);
  }

  override addEventListener(...args: Parameters<EventTarget['addEventListener']>) {
    mockAudioAddEventListener(...args);
    super.addEventListener(...args);
  }

  override removeEventListener(...args: Parameters<EventTarget['removeEventListener']>) {
    mockAudioRemoveEventListener(...args);
    super.removeEventListener(...args);
  }
}

globalThis.Audio = MockAudio as unknown as typeof Audio;

const getLastAudio = () => MockAudio.instances.at(-1)!;

beforeEach(() => {
  MockAudio.instances = [];
});

it('Should use audio', () => {
  const { result } = renderHook(() => useAudio('audio.mp3'));

  const audio = getLastAudio();

  expect(result.current.playing).toBeFalsy();
  expect(result.current.volume).toBe(1);
  expect(result.current.playbackRate).toBe(1);
  expect(result.current.play).toBeTypeOf('function');
  expect(result.current.pause).toBeTypeOf('function');
  expect(result.current.stop).toBeTypeOf('function');
  expect(result.current.setVolume).toBeTypeOf('function');
  expect(result.current.changePlaybackRate).toBeTypeOf('function');
  expect(MockAudio.instances).toHaveLength(1);
  expect(audio.src).toBe('audio.mp3');
  expect(audio.volume).toBe(1);
  expect(audio.playbackRate).toBe(1);
  expect(mockAudioPlay).not.toHaveBeenCalled();
});

it('Should use audio on server side', async () => {
  const { result } = renderHookServer(() => useAudio('audio.mp3'));

  expect(result.current.playing).toBeFalsy();
  expect(result.current.volume).toBe(1);
  expect(result.current.playbackRate).toBe(1);
  expect(result.current.play).toBeTypeOf('function');
  expect(result.current.pause).toBeTypeOf('function');
  expect(result.current.stop).toBeTypeOf('function');
  expect(result.current.setVolume).toBeTypeOf('function');
  expect(result.current.changePlaybackRate).toBeTypeOf('function');

  await expect(result.current.play()).resolves.toBeUndefined();
  result.current.pause();
  result.current.stop();
  result.current.setVolume(0.5);
  result.current.changePlaybackRate(1.5);

  expect(result.current.playing).toBeFalsy();
  expect(result.current.volume).toBe(1);
  expect(result.current.playbackRate).toBe(1);
  expect(MockAudio.instances).toHaveLength(0);
  expect(mockAudioPlay).not.toHaveBeenCalled();
  expect(mockAudioPause).not.toHaveBeenCalled();
});

it('Should initialize with custom options', () => {
  const options = {
    volume: 0,
    playbackRate: 0.5
  };

  const { result } = renderHook(() => useAudio('audio.mp3', options));

  const audio = getLastAudio();

  expect(result.current.volume).toBe(0);
  expect(result.current.playbackRate).toBe(0.5);
  expect(audio.src).toBe('audio.mp3');
  expect(audio.volume).toBe(0);
  expect(audio.playbackRate).toBe(0.5);
});

it('Should handle immediately option', () => {
  const { result } = renderHook(() => useAudio('audio.mp3', { immediately: true }));

  expect(result.current.playing).toBeTruthy();
  expect(mockAudioPlay).toHaveBeenCalledOnce();

  mockAudioPlay.mockImplementationOnce(() => {
    throw new Error('Failed to play audio');
  });

  const { result: errorResult } = renderHook(() =>
    useAudio('error-audio.mp3', { immediately: true })
  );

  expect(errorResult.current.playing).toBeFalsy();
  expect(mockAudioPlay).toHaveBeenCalledTimes(2);
});

it('Should play audio', async () => {
  const { result } = renderHook(() => useAudio('audio.mp3'));

  await act(async () => result.current.play());

  expect(result.current.playing).toBeTruthy();
  expect(mockAudioPlay).toHaveBeenCalledOnce();
});

it('Should react to playback events', () => {
  const { result } = renderHook(() => useAudio('audio.mp3'));

  const audio = getLastAudio();

  act(() => audio.dispatchEvent(new Event('play')));
  expect(result.current.playing).toBeTruthy();

  act(() => audio.dispatchEvent(new Event('pause')));
  expect(result.current.playing).toBeFalsy();

  act(() => audio.dispatchEvent(new Event('play')));
  expect(result.current.playing).toBeTruthy();

  act(() => audio.dispatchEvent(new Event('ended')));
  expect(result.current.playing).toBeFalsy();
});

it('Should react to volume change event', () => {
  const { result } = renderHook(() => useAudio('audio.mp3'));

  const audio = getLastAudio();
  audio.volume = 0.4;

  act(() => audio.dispatchEvent(new Event('volumechange')));

  expect(result.current.volume).toBe(0.4);
});

it('Should react to playback rate change event', () => {
  const { result } = renderHook(() => useAudio('audio.mp3'));

  const audio = getLastAudio();
  audio.playbackRate = 1.5;

  act(() => audio.dispatchEvent(new Event('ratechange')));

  expect(result.current.playbackRate).toBe(1.5);
});

it('Should interrupt current playback before playing audio', async () => {
  const { result } = renderHook(() => useAudio('audio.mp3', { interrupt: true }));

  const audio = getLastAudio();
  audio.currentTime = 10;

  await act(async () => result.current.play());

  expect(result.current.playing).toBeTruthy();
  expect(audio.currentTime).toBe(0);
  expect(mockAudioPause).toHaveBeenCalledOnce();
  expect(mockAudioPause).toHaveBeenCalledBefore(mockAudioPlay);
  expect(mockAudioPlay).toHaveBeenCalledOnce();
});

it('Should pause audio', async () => {
  const { result } = renderHook(() =>
    useAudio('audio.mp3', {
      immediately: true
    })
  );

  expect(result.current.playing).toBeTruthy();

  const audio = getLastAudio();
  audio.currentTime = 10;

  await act(result.current.pause);

  expect(result.current.playing).toBeFalsy();
  expect(audio.currentTime).toBe(10);
  expect(mockAudioPause).toHaveBeenCalledTimes(1);
});

it('Should stop audio', async () => {
  const { result } = renderHook(() =>
    useAudio('audio.mp3', {
      immediately: true
    })
  );

  expect(result.current.playing).toBeTruthy();

  const audio = getLastAudio();
  audio.currentTime = 10;

  await act(result.current.stop);

  expect(result.current.playing).toBeFalsy();
  expect(audio.currentTime).toBe(0);
  expect(mockAudioPause).toHaveBeenCalledTimes(1);
});

it('Should set volume', async () => {
  const { result } = renderHook(() => useAudio('audio.mp3'));

  act(() => result.current.setVolume(0.7));

  expect(result.current.volume).toBe(0.7);
  expect(getLastAudio().volume).toBe(0.7);
});

it('Should clamp volume between 0 and 1', () => {
  const { result } = renderHook(() => useAudio('audio.mp3'));

  act(() => result.current.setVolume(1.5));
  expect(result.current.volume).toBe(1);
  expect(getLastAudio().volume).toBe(1);

  act(() => result.current.setVolume(-0.5));
  expect(result.current.volume).toBe(0);
  expect(getLastAudio().volume).toBe(0);
});

it('Should change playback rate', () => {
  const { result } = renderHook(() => useAudio('audio.mp3'));

  act(() => result.current.changePlaybackRate(1.25));

  expect(result.current.playbackRate).toBe(1.25);
  expect(getLastAudio().playbackRate).toBe(1.25);
});

it('Should clamp playback rate between 0.5 and 2', () => {
  const { result } = renderHook(() => useAudio('audio.mp3'));

  act(() => result.current.changePlaybackRate(3));
  expect(result.current.playbackRate).toBe(2);
  expect(getLastAudio().playbackRate).toBe(2);

  act(() => result.current.changePlaybackRate(0.25));
  expect(result.current.playbackRate).toBe(0.5);
  expect(getLastAudio().playbackRate).toBe(0.5);
});

it('Should handle sprite playback', async () => {
  let animationFrameCallback!: FrameRequestCallback;
  const requestAnimationFrameSpy = vi
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation((callback) => {
      animationFrameCallback = callback;
      return 1;
    });
  const sprite = {
    intro: [2, 5],
    loop: [5, 15]
  } as SpriteMap;

  const { result } = renderHook(() => useAudio('audio.mp3', { sprite }));

  await act(async () => {
    await result.current.play('intro');
  });

  const audio = getLastAudio();

  expect(audio.currentTime).toBe(2);
  expect(mockAudioPlay).toHaveBeenCalledOnce();
  expect(requestAnimationFrameSpy).toHaveBeenCalledOnce();

  audio.currentTime = 5;
  act(() => animationFrameCallback(0));

  expect(result.current.playing).toBeFalsy();
  expect(audio.currentTime).toBe(0);
  expect(mockAudioPause).toHaveBeenCalledOnce();
});

it('Should play full audio for unknown sprite', async () => {
  const sprite = {
    intro: [2, 5]
  } as SpriteMap;
  const { result } = renderHook(() => useAudio('audio.mp3', { sprite }));

  const audio = getLastAudio();
  audio.currentTime = 3;

  await act(async () => result.current.play('unknown'));

  expect(result.current.playing).toBeTruthy();
  expect(audio.currentTime).toBe(3);
  expect(mockAudioPlay).toHaveBeenCalledOnce();
});

it('Should recreate effect', () => {
  const { rerender } = renderHook((src) => useAudio(src), {
    initialProps: 'audio.mp3'
  });

  const firstAudio = getLastAudio();

  rerender('new-audio.mp3');

  const secondAudio = getLastAudio();

  expect(MockAudio.instances).toHaveLength(2);
  expect(firstAudio.src).toBe('audio.mp3');
  expect(secondAudio.src).toBe('new-audio.mp3');
  expect(secondAudio).not.toBe(firstAudio);
  expect(mockAudioPause).toHaveBeenCalledOnce();
  expect(mockAudioRemove).toHaveBeenCalledOnce();
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
