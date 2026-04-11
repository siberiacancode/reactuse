import { act, renderHook } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UsePictureInPictureReturn } from './usePictureInPicture';

import { usePictureInPicture } from './usePictureInPicture';

const video = document.createElement('video');
video.id = 'video-target';
document.body.appendChild(video);

const element = document.getElementById('video-target') as HTMLVideoElement;

const targets = [
  undefined,
  target('#video-target'),
  target(document.getElementById('video-target')!),
  target(() => document.getElementById('video-target')!),
  { current: document.getElementById('video-target') },
  Object.assign(() => {}, {
    state: document.getElementById('video-target'),
    current: document.getElementById('video-target')
  })
];

beforeEach(() => {
  Object.defineProperty(document, 'pictureInPictureEnabled', {
    value: true,
    configurable: true
  });
  document.exitPictureInPicture = vi
    .fn()
    .mockResolvedValue(undefined) as typeof document.exitPictureInPicture;
  element.requestPictureInPicture = vi.fn().mockResolvedValue(undefined);
});

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use picture in picture', () => {
      const { result } = renderHook(() => {
        if (target) {
          return usePictureInPicture(target) as unknown as UsePictureInPictureReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }
        return usePictureInPicture();
      });

      expect(result.current.supported).toBeTruthy();
      expect(result.current.opened).toBeFalsy();
      expect(result.current.enter).toBeTypeOf('function');
      expect(result.current.exit).toBeTypeOf('function');
      expect(result.current.toggle).toBeTypeOf('function');
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current).not.toHaveProperty('ref');
    });

    it('Should use picture in picture on server side', () => {
      const { result } = renderHookServer(() => {
        if (target) {
          return usePictureInPicture(target) as unknown as UsePictureInPictureReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }
        return usePictureInPicture();
      });

      expect(result.current.supported).toBeFalsy();
      expect(result.current.opened).toBeFalsy();
      expect(result.current.enter).toBeTypeOf('function');
      expect(result.current.exit).toBeTypeOf('function');
      expect(result.current.toggle).toBeTypeOf('function');
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current).not.toHaveProperty('ref');
    });

    it('Should use picture in picture for unsupported', () => {
      Object.defineProperty(document, 'pictureInPictureEnabled', {
        value: false,
        configurable: true
      });

      const { result } = renderHook(() => {
        if (target) {
          return usePictureInPicture(target) as unknown as UsePictureInPictureReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }
        return usePictureInPicture();
      });

      expect(result.current.supported).toBeFalsy();
      expect(result.current.opened).toBeFalsy();
      expect(result.current.enter).toBeTypeOf('function');
      expect(result.current.exit).toBeTypeOf('function');
      expect(result.current.toggle).toBeTypeOf('function');
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current).not.toHaveProperty('ref');
    });

    it('Should handle enter', async () => {
      const { result } = renderHook(() => {
        if (target) {
          return usePictureInPicture(target) as unknown as UsePictureInPictureReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }
        return usePictureInPicture();
      });

      if (!target) act(() => result.current.ref(element));

      await act(result.current.enter);

      expect(element.requestPictureInPicture).toHaveBeenCalledTimes(1);
      expect(result.current.opened).toBeTruthy();
    });

    it('Should call onEnter when enter succeeds', async () => {
      const onEnter = vi.fn();

      const { result } = renderHook(() => {
        if (target) {
          return usePictureInPicture(target, {
            onEnter
          }) as unknown as UsePictureInPictureReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }
        return usePictureInPicture({ onEnter });
      });

      if (!target) act(() => result.current.ref(element));

      await act(result.current.enter);

      expect(onEnter).toHaveBeenCalledTimes(1);
      expect(element.requestPictureInPicture).toHaveBeenCalledTimes(1);
      expect(result.current.opened).toBeTruthy();
    });

    it('Should handle exit', async () => {
      const { result } = renderHook(() => {
        if (target) {
          return usePictureInPicture(target) as unknown as UsePictureInPictureReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }
        return usePictureInPicture();
      });

      if (!target) act(() => result.current.ref(element));

      await act(result.current.enter);

      await act(result.current.exit);

      expect(document.exitPictureInPicture).toHaveBeenCalledTimes(1);
      expect(result.current.opened).toBeFalsy();
    });

    it('Should call onExit when exit succeeds', async () => {
      const onExit = vi.fn();

      const { result } = renderHook(() => {
        if (target) {
          return usePictureInPicture(target, {
            onExit
          }) as unknown as UsePictureInPictureReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }
        return usePictureInPicture({ onExit });
      });

      if (!target) act(() => result.current.ref(element));

      await act(result.current.enter);

      await act(result.current.exit);

      expect(onExit).toHaveBeenCalledTimes(1);
      expect(document.exitPictureInPicture).toHaveBeenCalledTimes(1);
      expect(result.current.opened).toBeFalsy();
    });

    it('Should toggle between enter and exit', async () => {
      const { result } = renderHook(() => {
        if (target) {
          return usePictureInPicture(target) as unknown as UsePictureInPictureReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }
        return usePictureInPicture();
      });

      if (!target) act(() => result.current.ref(element));

      await act(result.current.toggle);

      expect(element.requestPictureInPicture).toHaveBeenCalledTimes(1);
      expect(result.current.opened).toBeTruthy();

      await act(result.current.toggle);

      expect(document.exitPictureInPicture).toHaveBeenCalledTimes(1);
      expect(result.current.opened).toBeFalsy();
    });

    it('Should react to enterpictureinpicture event', () => {
      const { result } = renderHook(() => {
        if (target) {
          return usePictureInPicture(target) as unknown as UsePictureInPictureReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }
        return usePictureInPicture();
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.opened).toBeFalsy();

      act(() => element.dispatchEvent(new Event('enterpictureinpicture')));

      expect(result.current.opened).toBeTruthy();
    });

    it('Should react to leavepictureinpicture event', async () => {
      const { result } = renderHook(() => {
        if (target) {
          return usePictureInPicture(target) as unknown as UsePictureInPictureReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }
        return usePictureInPicture();
      });

      if (!target) act(() => result.current.ref(element));

      await act(result.current.enter);

      expect(result.current.opened).toBeTruthy();

      act(() => element.dispatchEvent(new Event('leavepictureinpicture')));

      expect(result.current.opened).toBeFalsy();
    });

    it('Should handle target changes', () => {
      const addEventListenerSpy = vi.spyOn(element, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return usePictureInPicture(target) as unknown as {
              ref: StateRef<HTMLVideoElement>;
            };
          return usePictureInPicture();
        },
        { initialProps: target }
      );

      if (!target) act(() => result.current.ref(element));

      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);

      rerender({ current: document.getElementById('video-target') });

      expect(addEventListenerSpy).toHaveBeenCalledTimes(4);
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    });

    it('Should cleanup on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target) {
          return usePictureInPicture(target) as unknown as UsePictureInPictureReturn & {
            ref: StateRef<HTMLVideoElement>;
          };
        }
        return usePictureInPicture();
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'enterpictureinpicture',
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'leavepictureinpicture',
        expect.any(Function)
      );

      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    });
  });
});
