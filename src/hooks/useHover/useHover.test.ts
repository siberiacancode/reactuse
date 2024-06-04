import React from 'react';
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';

import { useHover } from './useHover';

const mockRef = {
  current: document.createElement('div')
};

it('Should use hover with provided target', () => {
  const { result } = renderHook(() => useHover(mockRef));

  expect(result.current).toBe(false);
});

it('Should use hover without provided target', () => {
  const { result } = renderHook(() => useHover({}));
  const [ref, hovering] = result.current;

  expect(ref.current).toBe(null);
  expect(hovering).toBe(false);
});

it('Should update hovering state when mouse enters and leaves the target', () => {
  const { result } = renderHook(() => useHover(mockRef));

  expect(result.current).toBe(false);

  act(() => fireEvent.mouseEnter(mockRef.current));
  expect(result.current).toBe(true);

  act(() => fireEvent.mouseLeave(mockRef.current));
  expect(result.current).toBe(false);
});

it('Should call callback function when provided', () => {
  const callback = vi.fn();

  renderHook(() => useHover(mockRef, callback));

  act(() => fireEvent.mouseEnter(mockRef.current));
  expect(callback).toHaveBeenCalledTimes(1);
});

it('Should call onEntry and onLeave callback functions when options provided', () => {
  const onEntry = vi.fn();
  const onLeave = vi.fn();

  renderHook(() => useHover(mockRef, { onEntry, onLeave }));

  act(() => fireEvent.mouseEnter(mockRef.current));
  expect(onEntry).toHaveBeenCalledTimes(1);

  act(() => fireEvent.mouseLeave(mockRef.current));
  expect(onLeave).toHaveBeenCalledTimes(1);
});

it('Should work properly without specifying a target element', () => {
  const MockComponent = () => {
    const [ref, isHovering] = useHover({});
    return React.createElement('div', { ref, 'data-testid': 'target' }, isHovering.toString());
  };

  render(React.createElement(MockComponent));
  const target = screen.getByTestId('target');

  expect(target).toHaveTextContent('false');

  fireEvent.mouseEnter(target);
  expect(target).toHaveTextContent('true');

  fireEvent.mouseLeave(target);
  expect(target).toHaveTextContent('false');
});
