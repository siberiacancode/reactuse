import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseTextareaAutosizeReturn } from './useTextareaAutosize';

import { useTextareaAutosize } from './useTextareaAutosize';

if (typeof document !== 'undefined') {
  const target = document.createElement('textarea');
  target.id = 'textarea-target';
  document.body.appendChild(target);
}

const element = document.getElementById('textarea-target') as HTMLTextAreaElement;

const targets = [
  undefined,
  target('#textarea-target'),
  target(document.getElementById('textarea-target')!),
  target(() => document.getElementById('textarea-target')!),
  { current: document.getElementById('textarea-target') },
  Object.assign(() => {}, {
    state: document.getElementById('textarea-target'),
    current: document.getElementById('textarea-target')
  })
];

targets.forEach((target) => {
  it('Should use textarea autosize', () => {
    const { result } = renderHook(() => {
      if (target)
        return useTextareaAutosize(target) as unknown as UseTextareaAutosizeReturn & {
          ref: StateRef<HTMLTextAreaElement>;
        };
      return useTextareaAutosize();
    });

    if (!target) act(() => result.current.ref(element));

    expect(result.current.value).toEqual('');
    expect(result.current.set).toBeTypeOf('function');
    expect(result.current.clear).toBeTypeOf('function');
  });

  it('Should use textarea autosize on server side', () => {
    const { result } = renderHookServer(() => {
      if (target)
        return useTextareaAutosize(target) as unknown as UseTextareaAutosizeReturn & {
          ref: StateRef<HTMLTextAreaElement>;
        };
      return useTextareaAutosize();
    });

    if (!target) act(() => result.current.ref(element));

    expect(result.current.value).toEqual('');
    expect(result.current.set).toBeTypeOf('function');
    expect(result.current.clear).toBeTypeOf('function');
  });

  it('Should set initial value in textarea', () => {
    const { result } = renderHookServer(() => {
      if (target)
        return useTextareaAutosize(target, 'initial') as unknown as UseTextareaAutosizeReturn & {
          ref: StateRef<HTMLTextAreaElement>;
        };
      return useTextareaAutosize('initial');
    });

    if (!target) act(() => result.current.ref(element));

    expect(result.current.value).toEqual('initial');
    expect(result.current.set).toBeTypeOf('function');
    expect(result.current.clear).toBeTypeOf('function');
  });

  it('Should set value in textarea', () => {
    const { result } = renderHook(() => {
      if (target)
        return useTextareaAutosize(target, 'initial') as unknown as UseTextareaAutosizeReturn & {
          ref: StateRef<HTMLTextAreaElement>;
        };
      return useTextareaAutosize('initial');
    });

    if (!target) act(() => result.current.ref(element));

    act(() => result.current.set('value'));

    expect(result.current.value).toEqual('value');
  });

  it('Should clear value in textarea', () => {
    const { result } = renderHook(() => {
      if (target)
        return useTextareaAutosize(target, 'initial') as unknown as UseTextareaAutosizeReturn & {
          ref: StateRef<HTMLTextAreaElement>;
        };
      return useTextareaAutosize('initial');
    });

    if (!target) act(() => result.current.ref(element));

    act(() => result.current.clear());

    expect(result.current.value).toEqual('');
  });

  it('Should call callback on resize', () => {
    Object.defineProperty(element, 'scrollHeight', { value: 100, configurable: true });

    const onResize = vi.fn();
    const { result } = renderHook(() => {
      if (target)
        return useTextareaAutosize(target, {
          onResize
        }) as unknown as UseTextareaAutosizeReturn & {
          ref: StateRef<HTMLTextAreaElement>;
        };
      return useTextareaAutosize({
        onResize
      });
    });

    if (!target) act(() => result.current.ref(element));

    act(() => element.dispatchEvent(new Event('resize')));

    expect(onResize).toHaveBeenCalledOnce();
  });

  it('Should call resize on input event', () => {
    Object.defineProperty(element, 'scrollHeight', { value: 100, configurable: true });

    const onResize = vi.fn();
    const { result } = renderHook(() => {
      if (target)
        return useTextareaAutosize(target, {
          onResize
        }) as unknown as UseTextareaAutosizeReturn & {
          ref: StateRef<HTMLTextAreaElement>;
        };
      return useTextareaAutosize({
        onResize
      });
    });

    if (!target) act(() => result.current.ref(element));

    act(() => element.dispatchEvent(new Event('input')));

    expect(onResize).toHaveBeenCalledOnce();
  });

  // it('Should cleanup on unmount', () => {
  //   const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');
  //   const { result, unmount } = renderHook(useTextareaAutosize);

  //   act(() => result.current.ref(element));

  //   unmount();

  //   expect(removeEventListenerSpy).toHaveBeenCalledWith('input', expect.any(Function));
  //   expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  // });
});
