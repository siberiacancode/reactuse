import { act, renderHook } from '@testing-library/react';

import { useTextDirection } from './useTextDirection';

it('Should use text direction', () => {
  const { result } = renderHook(() => useTextDirection());
  const [dir, set] = result.current;

  expect(dir).toBe('ltr');
  expect(typeof set).toBe('function');
});

it('Should set initial value to rtl', () => {
  const { result } = renderHook(() => useTextDirection({ initialValue: 'rtl' }));
  const [dir] = result.current;

  expect(dir).toBe('rtl');
});

it('Should set the direction attribute on a div element', () => {
  const div = document.createElement('div');

  div.setAttribute('id', '_divElement');

  document.body.appendChild(div);

  const { result } = renderHook(() => useTextDirection({ selector: '#_divElement' }));
  const [_, set] = result.current;

  expect(div.getAttribute('dir')).toBe(null);

  act(() => {
    set('rtl');
  });

  expect(div.getAttribute('dir')).toBe('rtl');

  act(() => {
    set('ltr');
  });

  expect(div.getAttribute('dir')).toBe('ltr');

  act(() => {
    set(null);
  });

  expect(div.getAttribute('dir')).toBe(null);

  document.body.removeChild(div);
});

// it('Should update direction when observe is enabled', () => {
//   const div = document.createElement('div');

//   div.setAttribute('id', '_divElement');

//   document.body.appendChild(div);

//   const { result } = renderHook(() =>
//     useTextDirection({ selector: '#_divElement', observe: true })
//   );

//   const [dir] = result.current;

//   act(() => {
//     div.setAttribute('dir', 'rtl');
//   });

//   expect(dir).toBe('rtl');

//   document.body.removeChild(div);
// });
