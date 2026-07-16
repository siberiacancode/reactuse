import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useWebWorker } from './useWebWorker';

class MockWorker extends EventTarget {
  static instances: MockWorker[] = [];

  readonly addEventListenerSpy = vi.fn();
  readonly removeEventListenerSpy = vi.fn();
  readonly postMessage = vi.fn();
  readonly terminate = vi.fn();

  constructor(
    readonly scriptURL?: string | URL,
    readonly options?: WorkerOptions
  ) {
    super();
    MockWorker.instances.push(this);
  }

  override addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions
  ) {
    this.addEventListenerSpy(type, callback, options);
    super.addEventListener(type, callback, options);
  }

  override removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions
  ) {
    this.removeEventListenerSpy(type, callback, options);
    super.removeEventListener(type, callback, options);
  }
}

const getLastWorker = () => MockWorker.instances.at(-1)!;

beforeEach(() => {
  MockWorker.instances = [];
  vi.stubGlobal('Worker', MockWorker);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

it('Should create web worker from URL', () => {
  const options: WorkerOptions = { name: 'parser', type: 'module' };
  const { result } = renderHook(() => useWebWorker('/worker.js', options));
  const worker = getLastWorker();

  expect(MockWorker.instances).toHaveLength(1);
  expect(worker.scriptURL).toBe('/worker.js');
  expect(worker.options).toBe(options);
  expect(result.current.data).toBeUndefined();
  expect(result.current.error).toBeUndefined();
  expect(result.current.post).toBeTypeOf('function');
  expect(result.current.terminate).toBeTypeOf('function');
});

it('Should create web worker from URL object', () => {
  const url = new URL('https://example.com/worker.js');

  renderHook(() => useWebWorker(url));

  expect(getLastWorker().scriptURL).toBe(url);
});

it('Should use web worker on server side', () => {
  const { result } = renderHookServer(() => useWebWorker('/worker.js'));

  expect(MockWorker.instances).toHaveLength(0);
  expect(result.current.data).toBeUndefined();
  expect(result.current.error).toBeUndefined();
  expect(result.current.post).toBeTypeOf('function');
  expect(result.current.terminate).toBeTypeOf('function');
});

it('Should handle unsupported web workers', () => {
  vi.stubGlobal('Worker', undefined);
  const { result } = renderHook(() => useWebWorker('/worker.js'));

  expect(MockWorker.instances).toHaveLength(0);
  expect(() => result.current.post('message')).not.toThrow();
  expect(() => result.current.terminate()).not.toThrow();
});

it('Should use and cleanup provided worker instance', () => {
  const worker = new MockWorker();
  const { result, unmount } = renderHook(() => useWebWorker(worker as unknown as Worker));

  expect(MockWorker.instances).toEqual([worker]);

  act(() => result.current.post('message'));
  expect(worker.postMessage).toHaveBeenCalledWith('message');

  unmount();

  expect(worker.terminate).toHaveBeenCalledOnce();
  expect(worker.removeEventListenerSpy).toHaveBeenCalledWith(
    'message',
    expect.any(Function),
    undefined
  );
  expect(worker.removeEventListenerSpy).toHaveBeenCalledWith(
    'error',
    expect.any(Function),
    undefined
  );
  expect(worker.removeEventListenerSpy).toHaveBeenCalledWith(
    'messageerror',
    expect.any(Function),
    undefined
  );
});

it('Should keep the latest received message', () => {
  const { result } = renderHook(() => useWebWorker<string>('/worker.js'));
  const worker = getLastWorker();

  act(() => worker.dispatchEvent(new MessageEvent('message', { data: 'first' })));
  expect(result.current.data).toBe('first');

  act(() => worker.dispatchEvent(new MessageEvent('message', { data: 'second' })));
  expect(result.current.data).toBe('second');
});

it('Should keep the latest worker error', () => {
  const { result } = renderHook(() => useWebWorker('/worker.js'));
  const worker = getLastWorker();
  const error = new ErrorEvent('error', { message: 'Worker failed' });
  const messageError = new MessageEvent('messageerror');

  act(() => worker.dispatchEvent(error));
  expect(result.current.error).toBe(error);

  act(() => worker.dispatchEvent(messageError));
  expect(result.current.error).toBe(messageError);
});

it('Should post messages and transferables to worker', () => {
  const { result } = renderHook(() => useWebWorker('/worker.js'));
  const worker = getLastWorker();
  const firstBuffer = new ArrayBuffer(8);
  const secondBuffer = new ArrayBuffer(8);

  act(() => result.current.post('message'));
  act(() => result.current.post({ buffer: firstBuffer }, [firstBuffer]));
  act(() => result.current.post({ buffer: secondBuffer }, { transfer: [secondBuffer] }));

  expect(worker.postMessage).toHaveBeenNthCalledWith(1, 'message');
  expect(worker.postMessage).toHaveBeenNthCalledWith(2, { buffer: firstBuffer }, [firstBuffer]);
  expect(worker.postMessage).toHaveBeenNthCalledWith(
    3,
    { buffer: secondBuffer },
    { transfer: [secondBuffer] }
  );
});

it('Should terminate worker once and detach its listeners on unmount', () => {
  const { result, unmount } = renderHook(() => useWebWorker('/worker.js'));
  const worker = getLastWorker();

  act(() => result.current.terminate());
  act(() => result.current.terminate());
  act(() => result.current.post('ignored'));
  unmount();

  expect(worker.terminate).toHaveBeenCalledOnce();
  expect(worker.postMessage).not.toHaveBeenCalled();
  expect(worker.removeEventListenerSpy).toHaveBeenCalledTimes(3);
});

it('Should terminate owned worker on unmount', () => {
  const { unmount } = renderHook(() => useWebWorker('/worker.js'));
  const worker = getLastWorker();

  unmount();

  expect(worker.terminate).toHaveBeenCalledOnce();
  expect(worker.removeEventListenerSpy).toHaveBeenCalledTimes(3);
});

it('Should stay connected when equivalent options rerender', () => {
  const { rerender } = renderHook(
    ({ options }: { options: WorkerOptions }) => useWebWorker('/worker.js', options),
    { initialProps: { options: { name: 'parser', type: 'module' } as WorkerOptions } }
  );
  const firstWorker = getLastWorker();

  rerender({ options: { name: 'parser', type: 'module' } });

  expect(MockWorker.instances).toHaveLength(1);
  expect(firstWorker.terminate).not.toHaveBeenCalled();

  rerender({ options: { name: 'next-parser', type: 'module' } });

  expect(MockWorker.instances).toHaveLength(2);
  expect(firstWorker.terminate).toHaveBeenCalledOnce();
  expect(getLastWorker().options).toEqual({ name: 'next-parser', type: 'module' });
});

it('Should reset state and replace owned worker when source changes', () => {
  const { result, rerender } = renderHook(
    ({ source }: { source: string }) => useWebWorker<string>(source),
    { initialProps: { source: '/first-worker.js' } }
  );
  const firstWorker = getLastWorker();

  act(() => firstWorker.dispatchEvent(new MessageEvent('message', { data: 'result' })));
  act(() => firstWorker.dispatchEvent(new Event('error')));
  expect(result.current.data).toBe('result');
  expect(result.current.error).toBeDefined();

  rerender({ source: '/second-worker.js' });

  expect(firstWorker.terminate).toHaveBeenCalledOnce();
  expect(MockWorker.instances).toHaveLength(2);
  expect(result.current.data).toBeUndefined();
  expect(result.current.error).toBeUndefined();
});

it('Should terminate provided worker when replacing it', () => {
  const firstWorker = new MockWorker();
  const secondWorker = new MockWorker();
  const { rerender, unmount } = renderHook(
    ({ worker }: { worker: Worker }) => useWebWorker(worker),
    { initialProps: { worker: firstWorker as unknown as Worker } }
  );

  rerender({ worker: secondWorker as unknown as Worker });

  expect(firstWorker.terminate).toHaveBeenCalledOnce();
  expect(firstWorker.removeEventListenerSpy).toHaveBeenCalledTimes(3);

  unmount();
  expect(secondWorker.terminate).toHaveBeenCalledOnce();
  expect(secondWorker.removeEventListenerSpy).toHaveBeenCalledTimes(3);
});
