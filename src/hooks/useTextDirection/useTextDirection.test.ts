import { act, renderHook } from '@testing-library/react';

import { useTextDirection } from './useTextDirection';

it('Should use text direction', () => {
  const { result } = renderHook(() => useTextDirection());
  const { ref, remove, set, value } = result.current;

  expect(value).toBe('ltr');
  expect(typeof set).toBe('function');
  expect(typeof remove).toBe('function');
  expect(typeof ref).toBe('function');
});

it('Should return initial value', () => {
  const div = document.createElement('div');

  div.setAttribute('dir', 'rtl');
  document.body.appendChild(div);

  const { result } = renderHook(() => useTextDirection(div));
  const { value } = result.current;

  expect(value).toBe('rtl');
});

it('Should set the direction attribute on a div element', () => {
  const div = document.createElement('div');

  document.body.appendChild(div);

  const { result } = renderHook(() => useTextDirection<HTMLDivElement>(div));
  const { set, remove } = result.current;

  expect(div.getAttribute('dir')).toBe(null);

  act(() => {
    set('ltr');
  });

  expect(div.getAttribute('dir')).toBe('ltr');

  act(() => {
    set('rtl');
  });

  expect(div.getAttribute('dir')).toBe('rtl');

  act(() => {
    remove();
  });

  expect(div.getAttribute('dir')).toBe(null);
});
