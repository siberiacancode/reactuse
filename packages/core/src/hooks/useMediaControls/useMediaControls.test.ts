import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, it, vi } from 'vitest';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseMediaControlsReturn, UseMediaSource } from './useMediaControls';

import { useMediaControls } from './useMediaControls';

const video = document.createElement('video');
video.id = 'media-controls-target';
document.body.appendChild(video);

const element = document.getElementById('media-controls-target') as HTMLVideoElement;

const mockPlay = vi.fn().mockResolvedValue(undefined);
const mockPause = vi.fn();

const createTimeRanges = (ranges: [number, number][]): TimeRanges =>
  ({
    length: ranges.length,
    start: (index: number) => ranges[index][0],
    end: (index: number) => ranges[index][1]
  }) as TimeRanges;

const targets = [
  undefined,
  target('#media-controls-target'),
  target(document.getElementById('media-controls-target')!),
  target(() => document.getElementById('media-controls-target')!),
  { current: document.getElementById('media-controls-target') },
  Object.assign(() => {}, {
    state: document.getElementById('media-controls-target'),
    current: document.getElementById('media-controls-target')
  })
];

const source: UseMediaSource = {
  src: 'video.mp4',
  type: 'video/mp4',
  media: '(min-width: 768px)'
};

const setupElement = (targetElement: HTMLVideoElement) => {
  targetElement.play = mockPlay as typeof targetElement.play;
  targetElement.pause = mockPause as typeof targetElement.pause;
  targetElement.src = '';
  targetElement.currentTime = 0;
  targetElement.volume = 1;
  targetElement.muted = false;
  targetElement.playbackRate = 1;

  Object.defineProperty(targetElement, 'duration', {
    value: 120,
    configurable: true
  });

  Object.defineProperty(targetElement, 'ended', {
    value: false,
    writable: true,
    configurable: true
  });

  Object.defineProperty(targetElement, 'buffered', {
    value: createTimeRanges([]),
    configurable: true
  });

  targetElement.removeAttribute('type');
  targetElement.removeAttribute('media');
};

beforeEach(() => {
  mockPlay.mockClear();
  mockPause.mockClear();
  setupElement(element);
});

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use media controls', () => {
      const { result } = renderHook(() => {
        if (target) {
          return useMediaControls(target, source) as UseMediaControlsReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }

        return useMediaControls<HTMLVideoElement>(source);
      });

      expect(result.current.buffered).toEqual([]);
      expect(result.current.currentTime).toBe(0);
      expect(result.current.duration).toBe(target ? 120 : 0);
      expect(result.current.ended).toBeFalsy();
      expect(result.current.muted).toBeFalsy();
      expect(result.current.playbackRate).toBe(1);
      expect(result.current.playing).toBeFalsy();
      expect(result.current.seeking).toBeFalsy();
      expect(result.current.stalled).toBeFalsy();
      expect(result.current.volume).toBe(1);
      expect(result.current.waiting).toBeFalsy();
      expect(result.current.play).toBeTypeOf('function');
      expect(result.current.pause).toBeTypeOf('function');
      expect(result.current.toggle).toBeTypeOf('function');
      expect(result.current.seek).toBeTypeOf('function');
      expect(result.current.changeVolume).toBeTypeOf('function');
      expect(result.current.mute).toBeTypeOf('function');
      expect(result.current.unmute).toBeTypeOf('function');
      expect(result.current.changePlaybackRate).toBeTypeOf('function');
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();
    });

    it('Should use media controls on server side', () => {
      const { result } = renderHookServer(() => {
        if (target) {
          return useMediaControls(target, source) as UseMediaControlsReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }

        return useMediaControls<HTMLVideoElement>(source);
      });

      expect(result.current.buffered).toEqual([]);
      expect(result.current.currentTime).toBe(0);
      expect(result.current.duration).toBe(0);
      expect(result.current.ended).toBeFalsy();
      expect(result.current.muted).toBeFalsy();
      expect(result.current.playbackRate).toBe(1);
      expect(result.current.playing).toBeFalsy();
      expect(result.current.seeking).toBeFalsy();
      expect(result.current.stalled).toBeFalsy();
      expect(result.current.volume).toBe(1);
      expect(result.current.waiting).toBeFalsy();
      expect(result.current.play).toBeTypeOf('function');
      expect(result.current.pause).toBeTypeOf('function');
      expect(result.current.toggle).toBeTypeOf('function');
      expect(result.current.seek).toBeTypeOf('function');
      expect(result.current.changeVolume).toBeTypeOf('function');
      expect(result.current.mute).toBeTypeOf('function');
      expect(result.current.unmute).toBeTypeOf('function');
      expect(result.current.changePlaybackRate).toBeTypeOf('function');
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();
    });

    it('Should initialize element attributes from options', () => {
      const { result } = renderHook(() => {
        if (target) {
          return useMediaControls(target, source) as UseMediaControlsReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }

        return useMediaControls<HTMLVideoElement>(source);
      });

      if (!target) act(() => result.current.ref(element));

      expect(element.src).toContain(source.src);
      expect(element.getAttribute('type')).toBe(source.type);
      expect(element.getAttribute('media')).toBe(source.media);
    });

    it('Should handle play', async () => {
      const { result } = renderHook(() => {
        if (target) {
          return useMediaControls(target, source) as UseMediaControlsReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }

        return useMediaControls<HTMLVideoElement>(source);
      });

      if (!target) act(() => result.current.ref(element));

      await act(result.current.play);

      expect(mockPlay).toHaveBeenCalledOnce();
    });

    it('Should handle pause', () => {
      const { result } = renderHook(() => {
        if (target) {
          return useMediaControls(target, source) as UseMediaControlsReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }

        return useMediaControls<HTMLVideoElement>(source);
      });

      if (!target) act(() => result.current.ref(element));

      act(result.current.pause);

      expect(mockPause).toHaveBeenCalledOnce();
    });

    it('Should handle toggle', async () => {
      const { result } = renderHook(() => {
        if (target) {
          return useMediaControls(target, source) as UseMediaControlsReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }

        return useMediaControls<HTMLVideoElement>(source);
      });

      if (!target) act(() => result.current.ref(element));

      await act(result.current.toggle);

      expect(mockPlay).toHaveBeenCalledOnce();

      act(() => element.dispatchEvent(new Event('playing')));
      await act(result.current.toggle);

      expect(mockPause).toHaveBeenCalledOnce();
    });

    it('Should handle seek', () => {
      const { result } = renderHook(() => {
        if (target) {
          return useMediaControls(target, source) as UseMediaControlsReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }

        return useMediaControls<HTMLVideoElement>(source);
      });

      if (!target) act(() => result.current.ref(element));

      act(() => result.current.seek(42));

      expect(element.currentTime).toBe(42);
    });

    it('Should clamp seek between 0 and duration', () => {
      const { result } = renderHook(() => {
        if (target) {
          return useMediaControls(target, source) as UseMediaControlsReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }

        return useMediaControls<HTMLVideoElement>(source);
      });

      if (!target) act(() => result.current.ref(element));

      act(() => result.current.seek(200));
      expect(element.currentTime).toBe(120);

      act(() => result.current.seek(-10));
      expect(element.currentTime).toBe(0);
    });

    it('Should handle volume changes', () => {
      const { result } = renderHook(() => {
        if (target) {
          return useMediaControls(target, source) as UseMediaControlsReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }

        return useMediaControls<HTMLVideoElement>(source);
      });

      if (!target) act(() => result.current.ref(element));

      act(() => {
        result.current.changeVolume(0.4);
        element.dispatchEvent(new Event('volumechange'));
      });

      expect(result.current.volume).toBe(0.4);
    });

    it('Should clamp volume between 0 and 1', () => {
      const { result } = renderHook(() => {
        if (target) {
          return useMediaControls(target, source) as UseMediaControlsReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }

        return useMediaControls<HTMLVideoElement>(source);
      });

      if (!target) act(() => result.current.ref(element));

      act(() => {
        result.current.changeVolume(10);
        element.dispatchEvent(new Event('volumechange'));
      });
      expect(result.current.volume).toBe(1);

      act(() => {
        result.current.changeVolume(-1);
        element.dispatchEvent(new Event('volumechange'));
      });
      expect(result.current.volume).toBe(0);
    });

    it('Should handle mute and unmute', () => {
      const { result } = renderHook(() => {
        if (target) {
          return useMediaControls(target, source) as UseMediaControlsReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }

        return useMediaControls<HTMLVideoElement>(source);
      });

      if (!target) act(() => result.current.ref(element));

      act(() => {
        result.current.mute();
        element.dispatchEvent(new Event('volumechange'));
      });

      expect(result.current.muted).toBeTruthy();

      act(() => {
        result.current.unmute();
        element.dispatchEvent(new Event('volumechange'));
      });

      expect(result.current.muted).toBeFalsy();
    });

    it('Should handle playback rate changes', () => {
      const { result } = renderHook(() => {
        if (target) {
          return useMediaControls(target, source) as UseMediaControlsReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }

        return useMediaControls<HTMLVideoElement>(source);
      });

      if (!target) act(() => result.current.ref(element));

      act(() => {
        result.current.changePlaybackRate(1.5);
        element.dispatchEvent(new Event('ratechange'));
      });

      expect(result.current.playbackRate).toBe(1.5);
    });

    it('Should react to media events', () => {
      const { result } = renderHook(() => {
        if (target) {
          return useMediaControls(target, source) as UseMediaControlsReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }

        return useMediaControls<HTMLVideoElement>(source);
      });

      if (!target) act(() => result.current.ref(element));

      act(() => {
        Object.defineProperty(element, 'duration', {
          value: 240,
          configurable: true
        });
        element.dispatchEvent(new Event('loadedmetadata'));
      });

      expect(result.current.duration).toBe(240);

      act(() => {
        element.currentTime = 24;
        element.dispatchEvent(new Event('timeupdate'));
      });

      expect(result.current.currentTime).toBe(24);

      act(() => element.dispatchEvent(new Event('playing')));
      expect(result.current.playing).toBeTruthy();
      expect(result.current.stalled).toBeFalsy();

      act(() => element.dispatchEvent(new Event('waiting')));
      expect(result.current.waiting).toBeTruthy();

      act(() => element.dispatchEvent(new Event('stalled')));
      expect(result.current.stalled).toBeTruthy();

      act(() => element.dispatchEvent(new Event('seeking')));
      expect(result.current.seeking).toBeTruthy();

      act(() => element.dispatchEvent(new Event('seeked')));
      expect(result.current.seeking).toBeFalsy();

      act(() => {
        Object.defineProperty(element, 'buffered', {
          value: createTimeRanges([[0, 60]]),
          configurable: true
        });
        element.dispatchEvent(new Event('progress'));
      });

      expect(result.current.buffered).toEqual([[0, 60]]);

      act(() => {
        Object.defineProperty(element, 'ended', {
          value: true,
          configurable: true
        });
        element.dispatchEvent(new Event('ended'));
      });

      expect(result.current.ended).toBeTruthy();
      expect(result.current.playing).toBeFalsy();

      act(() => element.dispatchEvent(new Event('pause')));
      expect(result.current.playing).toBeFalsy();
    });

    it('Should handle target changes', () => {
      const nextElement = document.createElement('video');
      const addEventListenerSpy = vi.spyOn(element, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      setupElement(nextElement);

      const { result, rerender } = renderHook(
        (nextTarget) => {
          if (nextTarget) {
            return useMediaControls(nextTarget, source) as UseMediaControlsReturn & {
              ref: StateRef<HTMLVideoElement>;
            };
          }

          return useMediaControls<HTMLVideoElement>(source);
        },
        { initialProps: target }
      );

      if (!target) act(() => result.current.ref(element));

      expect(addEventListenerSpy).toHaveBeenCalled();

      rerender({ current: nextElement });

      expect(removeEventListenerSpy).toHaveBeenCalled();
    });

    it('Should cleanup on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target) {
          return useMediaControls(target, source) as UseMediaControlsReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }

        return useMediaControls<HTMLVideoElement>(source);
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('playing', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('pause', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('waiting', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('progress', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('stalled', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('seeking', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('seeked', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('ended', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('loadedmetadata', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('timeupdate', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('volumechange', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('ratechange', expect.any(Function));
    });
  });
});
