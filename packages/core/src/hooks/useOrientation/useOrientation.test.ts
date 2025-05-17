import { act, renderHook } from '@testing-library/react';

import { createTrigger } from '@/tests';

import { useOrientation } from './useOrientation';

const trigger = createTrigger<string, () => void>();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
Object.assign(window, {
  screen: {
    orientation: {
      angle: 0,
      type: 'landscape-primary',
      addEventListener: (type: string, callback: () => void) => {
        trigger.add(type, callback);
        mockAddEventListener();
      },
      removeEventListener: (type: string) => {
        trigger.delete(type);
        mockRemoveEventListener();
      }
    }
  }
});

afterEach(() => {
  mockAddEventListener.mockClear();
  mockRemoveEventListener.mockClear();
});

it('Should use orientation', () => {
  const { result } = renderHook(useOrientation);

  expect(result.current.angle).toEqual(0);
  expect(result.current.type).toEqual('landscape-primary');
});

const orientations = [
  {
    angle: 90,
    type: 'landscape-primary'
  },
  {
    angle: 180,
    type: 'portrait-secondary'
  },
  {
    angle: 270,
    type: 'landscape-secondary'
  }
];

orientations.forEach((orientation) => {
  it(`Should handle change event with angle ${orientation.angle} and type ${orientation.type}`, async () => {
    const { result } = renderHook(useOrientation);

    expect(result.current.angle).toEqual(0);
    expect(result.current.type).toEqual('landscape-primary');

    Object.assign(window.screen.orientation, orientation);
    act(() => trigger.callback('change'));

    expect(mockAddEventListener).toHaveBeenCalledOnce();
    expect(result.current.angle).toEqual(orientation.angle);
    expect(result.current.type).toEqual(orientation.type);
  });

  it('Should disconnect on onmount', () => {
    const { unmount } = renderHook(useOrientation);

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledOnce();
  });
});
