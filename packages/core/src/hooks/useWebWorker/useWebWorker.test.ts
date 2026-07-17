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

  Object.defineProperty(window, 'Worker', {
    value: MockWorker,
    writable: true,
    configurable: true
  });
});

it('Should use web worker', () => {
  const { result } = renderHook(() => useWebWorker('/worker.js'));

  expect(result.current.terminated).toBeFalsy();
  expect(result.current.data).toBeUndefined();
  expect(result.current.error).toBeUndefined();
  expect(result.current.post).toBeTypeOf('function');
  expect(result.current.restart).toBeTypeOf('function');
  expect(result.current.terminate).toBeTypeOf('function');
});

it('Should use web worker on server side', () => {
  const { result } = renderHookServer(() => useWebWorker('/worker.js'));

  expect(result.current.terminated).toBeFalsy();
  expect(result.current.data).toBeUndefined();
  expect(result.current.error).toBeUndefined();
  expect(result.current.post).toBeTypeOf('function');
  expect(result.current.restart).toBeTypeOf('function');
  expect(result.current.terminate).toBeTypeOf('function');
});

it('Should use web worker from url object', () => {
  const url = new URL('https://example.com/worker.js');

  renderHook(() => useWebWorker(url));

  expect(getLastWorker().scriptURL).toBe(url);
});

it('Should use provided worker instance', () => {
  const worker = new MockWorker();
  const { result } = renderHook(() => useWebWorker(worker as unknown as Worker));

  expect(MockWorker.instances).toEqual([worker]);

  act(() => result.current.post('message'));

  expect(worker.postMessage).toHaveBeenCalledWith('message');
});

it('Should handle worker options', () => {
  renderHook(() =>
    useWebWorker('/worker.js', {
      name: 'parser',
      type: 'module'
    })
  );

  expect(getLastWorker().options).toEqual({
    credentials: undefined,
    name: 'parser',
    type: 'module'
  });
});

it('Should not pass callbacks to worker options', () => {
  renderHook(() =>
    useWebWorker('/worker.js', {
      name: 'parser',
      type: 'module',
      onMessage: vi.fn(),
      onError: vi.fn()
    })
  );

  expect(getLastWorker().options).toEqual({
    credentials: undefined,
    name: 'parser',
    type: 'module'
  });
});

it('Should keep the latest received message', () => {
  const { result } = renderHook(() => useWebWorker('/worker.js'));
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

it('Should call onMessage when message is received', () => {
  const onMessage = vi.fn();

  renderHook(() => useWebWorker<string>('/worker.js', { onMessage }));

  const event = new MessageEvent('message', { data: 'result' });

  act(() => getLastWorker().dispatchEvent(event));

  expect(onMessage).toHaveBeenCalledOnce();
  expect(onMessage).toHaveBeenCalledWith('result', event);
});

it('Should call onError when worker errors', () => {
  const onError = vi.fn();

  renderHook(() => useWebWorker('/worker.js', { onError }));

  const error = new ErrorEvent('error', { message: 'Worker failed' });

  act(() => getLastWorker().dispatchEvent(error));

  expect(onError).toHaveBeenCalledOnce();
  expect(onError).toHaveBeenCalledWith(error);
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

it('Should terminate worker', () => {
  const { result } = renderHook(() => useWebWorker('/worker.js'));
  const worker = getLastWorker();

  act(result.current.terminate);

  expect(worker.terminate).toHaveBeenCalledOnce();
  expect(result.current.terminated).toBeTruthy();
});

it('Should not terminate worker twice', () => {
  const { result } = renderHook(() => useWebWorker('/worker.js'));
  const worker = getLastWorker();

  act(result.current.terminate);
  act(result.current.terminate);
  act(() => result.current.post('ignored'));

  expect(worker.terminate).toHaveBeenCalledOnce();
  expect(worker.postMessage).not.toHaveBeenCalled();
});

it('Should restart worker', () => {
  const { result } = renderHook(() => useWebWorker<string>('/worker.js'));
  const firstWorker = getLastWorker();

  act(() => firstWorker.dispatchEvent(new MessageEvent('message', { data: 'result' })));
  act(result.current.terminate);
  act(result.current.restart);

  expect(MockWorker.instances).toHaveLength(2);
  expect(result.current.terminated).toBeFalsy();
  expect(result.current.data).toBeUndefined();

  act(() => result.current.post('message'));

  expect(getLastWorker().postMessage).toHaveBeenCalledWith('message');
});

it('Should handle source changes', () => {
  const { result, rerender } = renderHook(
    ({ source }: { source: string }) => useWebWorker<string>(source),
    { initialProps: { source: '/first-worker.js' } }
  );
  const firstWorker = getLastWorker();

  act(() => firstWorker.dispatchEvent(new MessageEvent('message', { data: 'result' })));
  act(() => firstWorker.dispatchEvent(new ErrorEvent('error')));

  expect(result.current.data).toBe('result');
  expect(result.current.error).toBeDefined();

  rerender({ source: '/second-worker.js' });

  expect(firstWorker.terminate).toHaveBeenCalledOnce();
  expect(MockWorker.instances).toHaveLength(2);
  expect(result.current.data).toBeUndefined();
  expect(result.current.error).toBeUndefined();
  expect(result.current.terminated).toBeFalsy();
});

it('Should cleanup on unmount', () => {
  const { unmount } = renderHook(() => useWebWorker('/worker.js'));
  const worker = getLastWorker();

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
