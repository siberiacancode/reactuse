import { act, renderHook, waitFor } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useImage } from './useImage';

const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
let mockImage = {} as MockImage;

class MockImage extends EventTarget {
  static complete = false;
  static naturalWidth = 0;

  alt = '';
  className = '';
  complete = MockImage.complete;
  crossOrigin: string | null = null;
  loading: HTMLImageElement['loading'] = 'eager';
  naturalWidth = MockImage.naturalWidth;
  referrerPolicy: HTMLImageElement['referrerPolicy'] = '';
  sizes = '';
  src = '';
  srcset = '';

  constructor() {
    super();
    mockImage = this as MockImage;
  }

  override addEventListener(...args: Parameters<EventTarget['addEventListener']>) {
    mockAddEventListener(...args);
    super.addEventListener(...args);
  }

  override removeEventListener(...args: Parameters<EventTarget['removeEventListener']>) {
    mockRemoveEventListener(...args);
    super.removeEventListener(...args);
  }
}

beforeEach(() => {
  mockImage = {} as MockImage;
  MockImage.complete = false;
  MockImage.naturalWidth = 0;
  mockAddEventListener.mockClear();
  mockRemoveEventListener.mockClear();
  Object.defineProperty(window, 'Image', {
    value: MockImage,
    writable: true,
    configurable: true
  });
});

it('Should use image', () => {
  const { result } = renderHook(() =>
    useImage('https://siberiacancode.github.io/reactuse/logo.svg')
  );

  expect(result.current.isLoading).toBeTruthy();
  expect(result.current.isError).toBeFalsy();
  expect(result.current.isSuccess).toBeFalsy();
  expect(result.current.value).toBeUndefined();
  expect(result.current.error).toBeUndefined();
});

it('Should use image on server side', () => {
  const { result } = renderHookServer(() =>
    useImage('https://siberiacancode.github.io/reactuse/logo.svg')
  );

  expect(result.current.isLoading).toBeTruthy();
  expect(result.current.isError).toBeFalsy();
  expect(result.current.isSuccess).toBeFalsy();
  expect(result.current.value).toBeUndefined();
  expect(result.current.error).toBeUndefined();
});

it('Should handle loaded image', async () => {
  const { result } = renderHook(() =>
    useImage('https://siberiacancode.github.io/reactuse/logo.svg')
  );

  const image = mockImage;

  act(() => {
    image.complete = true;
    image.naturalWidth = 100;
    image.dispatchEvent(new Event('load'));
  });

  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isError).toBeFalsy();
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.value).toBe(image);
    expect(result.current.error).toBeUndefined();
  });
});

it('Should handle image error', async () => {
  const { result } = renderHook(() =>
    useImage('https://siberiacancode.github.io/reactuse/logo.svg')
  );

  const image = mockImage;
  const event = new Event('error');

  act(() => image.dispatchEvent(event));

  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isError).toBeTruthy();
    expect(result.current.isSuccess).toBeFalsy();
    expect(result.current.value).toBeUndefined();
    expect(result.current.error).toBe(event);
  });
});

it('Should handle already loaded image', async () => {
  MockImage.complete = true;
  MockImage.naturalWidth = 100;

  const { result } = renderHook(() =>
    useImage('https://siberiacancode.github.io/reactuse/logo.svg')
  );

  const image = mockImage;

  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isError).toBeFalsy();
    expect(result.current.isSuccess).toBeTruthy();
    expect(result.current.value).toBe(image);
    expect(result.current.error).toBeUndefined();
  });
});

it('Should handle already failed image', async () => {
  MockImage.complete = true;
  MockImage.naturalWidth = 0;

  const { result } = renderHook(() =>
    useImage('https://siberiacancode.github.io/reactuse/logo.svg')
  );

  await waitFor(() => {
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isError).toBeTruthy();
    expect(result.current.isSuccess).toBeFalsy();
    expect(result.current.value).toBeUndefined();
    expect(result.current.error?.type).toBe('error');
  });
});

it('Should apply all image options correctly', () => {
  const options = {
    alt: 'test alt',
    class: 'test-image-class',
    crossorigin: 'anonymous',
    loading: 'lazy',
    referrerPolicy: 'no-referrer',
    sizes: '(max-width: 600px) 480px, 800px',
    srcset: 'image-320w.jpg 320w, image-480w.jpg 480w, image-800w.jpg 800w'
  } as const;

  renderHook(() => useImage('https://siberiacancode.github.io/reactuse/logo.svg', options));

  const image = mockImage;

  expect(image.src).toBe('https://siberiacancode.github.io/reactuse/logo.svg');
  expect(image.alt).toBe(options.alt);
  expect(image.srcset).toBe(options.srcset);
  expect(image.sizes).toBe(options.sizes);
  expect(image.className).toBe(options.class);
  expect(image.loading).toBe(options.loading);
  expect(image.crossOrigin).toBe(options.crossorigin);
  expect(image.referrerPolicy).toBe(options.referrerPolicy);
});

it('Should cleanup event listeners on unmount', () => {
  const { unmount } = renderHook(() =>
    useImage('https://siberiacancode.github.io/reactuse/logo.svg')
  );

  unmount();

  expect(mockRemoveEventListener).toHaveBeenCalledWith('load', expect.any(Function));
  expect(mockRemoveEventListener).toHaveBeenCalledWith('error', expect.any(Function));
});
