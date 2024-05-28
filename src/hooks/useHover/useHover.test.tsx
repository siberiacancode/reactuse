import { act, cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';

import { useHover } from './useHover';

describe('useHover', () => {
  afterEach(cleanup);

  const mockRef = {
    current: document.createElement('div')
  };

  it('should return ref and hovering state without target element overload', () => {
    const { result } = renderHook(() => useHover({}));
    const [ref, hovering] = result.current;

    expect(ref.current).toBe(null);
    expect(hovering).toBe(false);
  });

  it('should update hovering state when mouse enters and leaves the target', () => {
    const { result } = renderHook(() => useHover(mockRef));

    expect(result.current).toBe(false);

    act(() => fireEvent.mouseEnter(mockRef.current));
    expect(result.current).toBe(true);

    act(() => fireEvent.mouseLeave(mockRef.current));
    expect(result.current).toBe(false);
  });

  it('should call onEntry and onLeave callback functions when provided', () => {
    const onEntry = vi.fn();
    const onLeave = vi.fn();

    renderHook(() => useHover(mockRef, { onEntry, onLeave }));

    act(() => fireEvent.mouseEnter(mockRef.current));
    expect(onEntry).toHaveBeenCalledTimes(1);

    act(() => fireEvent.mouseLeave(mockRef.current));
    expect(onLeave).toHaveBeenCalledTimes(1);
  });

  it('should work properly without specifying a target element overload', () => {
    const MockComponent = () => {
      const [ref, isHovering] = useHover({});

      return (
        <div data-testid='target' ref={ref as React.RefObject<HTMLDivElement>}>
          {isHovering ? 'true' : 'false'}
        </div>
      );
    };

    render(<MockComponent />);
    const target = screen.getByTestId('target');

    expect(target).toHaveTextContent('false');

    fireEvent.mouseEnter(target);
    expect(target).toHaveTextContent('true');

    fireEvent.mouseLeave(target);
    expect(target).toHaveTextContent('false');
  });
});
