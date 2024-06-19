import { act, renderHook, waitFor } from '@testing-library/react';

import { useOrientation } from './useOrientation';

let events: Record<string, () => void>;
let orientation: typeof orientationPreset;

const orientationPreset = {
  type: 'landscape-primary',
  angle: 0,
  onchange: null,
  unlock: vi.fn(),
  addEventListener: (type: string, callback: () => void) => {
    events[type] = callback;
  },
  removeEventListener: (type: string, callback: () => void) => {
    if (events[type] === callback) {
      delete events[type];
    }
  },
  dispatchEvent: (event: Event) => {
    events[event.type]?.();
  }
};

beforeEach(() => {
  events = {};
  orientation = { ...orientationPreset };
  Object.assign(window, {
    screen: { orientation }
  });
});

it('should unsubscribe from event listener on unmount', () => {
  const { unmount } = renderHook(useOrientation);

  const mockRemoveEventListener = vi.fn();
  orientation.removeEventListener = mockRemoveEventListener;

  act(() => {
    unmount();
  });

  expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
});

it('should subscribe on event listener on mount', () => {
  const mockAddEventListener = vi.fn();
  orientation.addEventListener = mockAddEventListener;

  renderHook(useOrientation);

  expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
});

it('Should return current window orientation', () => {
  const { result } = renderHook(useOrientation);

  expect(typeof result.current).toBe('object');
  expect(typeof result.current.type).toBe('string');
  expect(typeof result.current.angle).toBe('number');
});

it('should use initial values in case of no parameters', () => {
  const { result } = renderHook(useOrientation);

  expect(result.current.type).toBe('landscape-primary');
  expect(result.current.angle).toBe(0);
});

it('Should use orientation', () => {
  const { result } = renderHook(useOrientation);

  expect(result.current).toEqual({
    angle: 0,
    type: 'landscape-primary'
  });
});

it('Should handle change event with angle 90 and type landscape-primary', async () => {
  const { result } = renderHook(useOrientation);

  act(() => {
    orientation.angle = 90;
    orientation.type = 'landscape-primary';
    orientation.dispatchEvent(new Event('change'));
  });

  await waitFor(() =>
    expect(result.current).toEqual({
      angle: 90,
      type: 'landscape-primary'
    })
  );
});

it('Should handle change event with angle 180 and type portrait-secondary', async () => {
  const { result } = renderHook(useOrientation);

  act(() => {
    orientation.angle = 180;
    orientation.type = 'portrait-secondary';
    orientation.dispatchEvent(new Event('change'));
  });

  await waitFor(() =>
    expect(result.current).toEqual({
      angle: 180,
      type: 'portrait-secondary'
    })
  );
});

it('Should handle change event with angle 270 and type landscape-secondary', async () => {
  const { result } = renderHook(useOrientation);

  act(() => {
    orientation.angle = 270;
    orientation.type = 'landscape-secondary';
    orientation.dispatchEvent(new Event('change'));
  });

  await waitFor(() =>
    expect(result.current).toEqual({
      angle: 270,
      type: 'landscape-secondary'
    })
  );
});
