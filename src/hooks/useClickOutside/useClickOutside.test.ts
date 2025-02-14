import { act, renderHook } from '@testing-library/react';

import { useClickOutside } from './useClickOutside';

it('Should use click outside', () => {
  const { result } = renderHook(() => useClickOutside(vi.fn()));

  expect(result.current).toBeTypeOf('function');
});

it('Should call callback when ref connected to the document', () => {
  const callback = vi.fn();
  const element = document.createElement('div');

  const { result } = renderHook(() => useClickOutside(callback));
  act(() => result.current(element));

  expect(callback).not.toBeCalled();

  act(() => document.dispatchEvent(new Event('click')));

  expect(callback).toBeCalledTimes(1);
});

it('Should call callback when clicked outside the element', () => {
  const callback = vi.fn();
  const element = document.createElement('div');

  renderHook(() => useClickOutside(element, callback));

  expect(callback).not.toBeCalled();

  act(() => document.dispatchEvent(new Event('click')));

  expect(callback).toBeCalledTimes(1);
});

it('Should call callback when clicked outside the ref', () => {
  const callback = vi.fn();
  const ref = { current: document.createElement('div') };

  renderHook(() => useClickOutside(ref, callback));

  expect(callback).not.toBeCalled();

  act(() => document.dispatchEvent(new Event('click')));

  expect(callback).toBeCalledTimes(1);
});

it('Should call callback when clicked outside the function that returns an element', () => {
  const callback = vi.fn();
  const getElement = () => document.createElement('div');

  renderHook(() => useClickOutside(getElement, callback));

  expect(callback).not.toBeCalled();

  act(() => document.dispatchEvent(new Event('click')));

  expect(callback).toBeCalledTimes(1);
});

it('Should not call callback when clicked inside the ref', () => {
  const callback = vi.fn();
  const ref = { current: document.createElement('div') };
  document.body.appendChild(ref.current);

  renderHook(() => useClickOutside(ref, callback));

  act(() => ref.current.dispatchEvent(new Event('click')));

  expect(callback).not.toBeCalled();
});

it('Should not call callback when clicked inside the element', () => {
  const element = document.createElement('div');
  document.body.appendChild(element);

  const callback = vi.fn();

  renderHook(() => useClickOutside(element, callback));

  act(() => element.dispatchEvent(new Event('click')));

  expect(callback).not.toBeCalled();
});

it('Should not call callback when clicked inside the function that returns an element', () => {
  const element = document.createElement('div');
  document.body.appendChild(element);

  const getElement = () => element;
  const callback = vi.fn();

  renderHook(() => useClickOutside(getElement, callback));

  act(() => element.dispatchEvent(new Event('click')));

  expect(callback).not.toBeCalled();
});

it('Should call callback when clicked outside the element (multiple targets)', () => {
  const element = document.createElement('div');
  document.body.appendChild(element);

  const elementForGetElementFunction = document.createElement('div');
  document.body.appendChild(elementForGetElementFunction);
  const getElement = () => elementForGetElementFunction;

  const ref = { current: document.createElement('div') };
  document.body.appendChild(ref.current);

  const callback = vi.fn();

  renderHook(() => useClickOutside([element, ref, getElement], callback));

  act(() => document.dispatchEvent(new Event('click')));

  expect(callback).toBeCalledTimes(1);
});
