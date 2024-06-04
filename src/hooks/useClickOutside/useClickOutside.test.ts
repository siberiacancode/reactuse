import { act, fireEvent, renderHook } from '@testing-library/react';

import { useClickOutside } from './useClickOutside';

it('Should return ref when there is no target', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useClickOutside(callback));

  expect(result.current).toEqual({ current: null });
});

it('Should call callback on mousedown and touchstart events', () => {
  const element = document.createElement('div');
  const callback = vi.fn();

  renderHook(() => useClickOutside(element, callback));

  expect(callback).not.toBeCalled();

  act(() => {
    fireEvent.mouseDown(document);
    fireEvent.touchStart(document);
  });

  expect(callback).toBeCalledTimes(2);
});

it('Should call callback when clicked outside the element (ref)', () => {
  const ref = { current: document.createElement('div') };
  const callback = vi.fn();

  renderHook(() => useClickOutside(ref, callback));

  expect(callback).not.toBeCalled();

  act(() => {
    fireEvent.touchStart(document);
  });

  expect(callback).toBeCalledTimes(1);
});

it('Should call callback when clicked outside the element (Element)', () => {
  const element = document.createElement('div');
  const callback = vi.fn();

  renderHook(() => useClickOutside(element, callback));

  expect(callback).not.toBeCalled();

  act(() => {
    fireEvent.touchStart(document);
  });

  expect(callback).toBeCalledTimes(1);
});

it('Should call callback when clicked outside the element (function that returns an Element)', () => {
  const getElement = () => document.createElement('div');
  const callback = vi.fn();

  renderHook(() => useClickOutside(getElement, callback));

  expect(callback).not.toBeCalled();

  act(() => {
    fireEvent.touchStart(document);
  });

  expect(callback).toBeCalledTimes(1);
});

it('Should call callback when clicked outside the element (multiple targets)', () => {
  const element = document.createElement('div');
  const elementForGetElementFunction = document.createElement('div');
  const getElement = () => elementForGetElementFunction;
  const ref = { current: document.createElement('div') };
  const callback = vi.fn();

  renderHook(() => useClickOutside([element, ref, getElement], callback));

  act(() => {
    document.body.appendChild(element);
    document.body.appendChild(elementForGetElementFunction);
    document.body.appendChild(ref.current);
    fireEvent.touchStart(element);
    fireEvent.touchStart(elementForGetElementFunction);
    fireEvent.touchStart(ref.current);
  });

  expect(callback).toBeCalledTimes(6);
});

it('Should not call callback when clicked inside the element (ref)', () => {
  const ref = { current: document.createElement('div') };
  const callback = vi.fn();

  renderHook(() => useClickOutside(ref, callback));

  act(() => {
    document.body.appendChild(ref.current);
    fireEvent.touchStart(ref.current);
  });

  expect(callback).not.toBeCalled();
});

it('Should not call callback when clicked inside the element (Element)', () => {
  const element = document.createElement('div');
  const callback = vi.fn();

  renderHook(() => useClickOutside(element, callback));

  act(() => {
    document.body.appendChild(element);
    fireEvent.touchStart(element);
  });

  expect(callback).not.toBeCalled();
});

it('Should not call callback when clicked inside the element (function that returns an Element)', () => {
  const element = document.createElement('div');
  const getElement = () => element;
  const callback = vi.fn();

  renderHook(() => useClickOutside(getElement, callback));

  act(() => {
    document.body.appendChild(element);
    fireEvent.touchStart(element);
  });

  expect(callback).not.toBeCalled();
});

it('Should not call callback when clicked a non-connected element', () => {
  const ref = { current: document.createElement('div') };
  const callback = vi.fn();

  renderHook(() => useClickOutside(ref, callback));

  act(() => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    document.body.removeChild(element);
    fireEvent.touchStart(element);
  });

  expect(callback).not.toBeCalled();
});

it('Should not call callback when ref does not pass in DOM element', () => {
  const callback = vi.fn();

  renderHook(() => useClickOutside(callback));

  act(() => {
    fireEvent.touchStart(document);
  });

  expect(callback).not.toBeCalled();
});
