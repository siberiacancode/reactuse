import { renderHook } from '@testing-library/react';

import { useElementSize } from './useElementSize';

window.ResizeObserver = vi.fn().mockImplementation((callback: ResizeObserverCallback) => {
  return {
    observe: (target: Element) => {
      const width = Number.parseFloat(getComputedStyle(target).width || '0');
      const height = Number.parseFloat(getComputedStyle(target).height || '0');
      callback(
        [
          {
            target,
            contentRect: {
              width,
              height,
              top: 0,
              left: 0,
              right: width,
              bottom: height,
              x: 0,
              y: 0
            },
            borderBoxSize: [{ inlineSize: width, blockSize: height }]
          }
        ] as unknown as ResizeObserverEntry[],
        null as any
      );
    },
    unobserve: vi.fn(),
    disconnect: vi.fn()
  };
});

it('Should use element size', () => {
  const { result } = renderHook(() => useElementSize());

  const { ref, value } = result.current;

  expect(typeof ref).toBe('function');
  expect(value).toEqual({ width: 0, height: 0 });
});

it('Should set initial value', () => {
  const { result } = renderHook(() => useElementSize({ width: 100, height: 100 }));

  expect(result.current.value).toEqual({ width: 100, height: 100 });
});

// it('Should update value', () => {
//   const div = document.createElement('div');

//   document.body.appendChild(div);

//   const { result } = renderHook(() => useElementSize(div));

//   expect(result.current.value).toEqual({ width: 0, height: 0 });

//   div.style.width = '100px';
//   div.style.height = '100px';

//   (window.ResizeObserver as any).mock.calls[0][0]([
//     {
//       target: div,
//       contentRect: { width: 100, height: 100 }
//     }
//   ]);

//   expect(result.current.value).toEqual({ width: 100, height: 100 });

//   document.body.removeChild(div);
// });
