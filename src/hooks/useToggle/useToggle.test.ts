import { act, renderHook } from '@testing-library/react';

import { useToggle } from './useToggle';

it('Should useToggle with boolean by default', () => {
  const { result } = renderHook(() => useToggle());
  const [value, toggle] = result.current;

  expect(value).toBe(false);
  expect(typeof toggle).toBe('function');
});

it('Should toggle value', () => {
  const themeModeVariants = ['light', 'dark'] as const;
  const { result } = renderHook(() => useToggle(themeModeVariants));
  const toggle = result.current[1];

  expect(result.current[0]).toBe('light');

  act(() => {
    toggle();
  });

  expect(result.current[0]).toBe('dark');
});

it('Should set the first element after toggle', () => {
  const themeVariants = ['green', 'blue', 'red'] as const;
  const { result } = renderHook(() => useToggle(themeVariants));
  const toggle = result.current[1];

  expect(result.current[0]).toBe('green');

  act(() => {
    toggle();
    toggle();
    toggle();
  });

  expect(result.current[0]).toBe('green');
});
