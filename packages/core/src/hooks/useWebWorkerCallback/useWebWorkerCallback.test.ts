import { act, renderHook, waitFor } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useWebWorkerCallback } from './useWebWorkerCallback';

class MockWorker extends EventTarget {
  static instances: MockWorker[] = [];

  readonly postMessage = vi.fn();
  readonly terminate = vi.fn();

  constructor(readonly scriptURL?: string | URL) {
    super();
    MockWorker.instances.push(this);
  }
}

const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
const mockRevokeObjectURL = vi.fn();

const getLastWorker = () => MockWorker.instances.at(-1)!;

const callback = (value: number) => value * 2;

beforeEach(() => {
  vi.clearAllMocks();

  MockWorker.instances = [];

  Object.defineProperty(window, 'Worker', {
    value: MockWorker,
    writable: true,
    configurable: true
  });

  Object.defineProperty(URL, 'createObjectURL', {
    value: mockCreateObjectURL,
    writable: true,
    configurable: true
  });

  Object.defineProperty(URL, 'revokeObjectURL', {
    value: mockRevokeObjectURL,
    writable: true,
    configurable: true
  });
});

it('Should use web worker callback', () => {
  const { result } = renderHook(() => useWebWorkerCallback(callback));

  expect(MockWorker.instances).toHaveLength(0);
  expect(result.current.pending).toBeFalsy();
  expect(result.current.run).toBeTypeOf('function');
  expect(result.current.terminate).toBeTypeOf('function');
});

it('Should use web worker callback on server side', () => {
  const { result } = renderHookServer(() => useWebWorkerCallback(callback));

  expect(MockWorker.instances).toHaveLength(0);
  expect(result.current.pending).toBeFalsy();
  expect(result.current.run).toBeTypeOf('function');
  expect(result.current.terminate).toBeTypeOf('function');
});

it('Should create worker on run', () => {
  const { result } = renderHook(() => useWebWorkerCallback(callback));

  act(() => {
    result.current.run(1);
  });

  expect(MockWorker.instances).toHaveLength(1);
  expect(getLastWorker().scriptURL).toBe('blob:mock-url');
  expect(mockCreateObjectURL).toHaveBeenCalledOnce();
  expect(result.current.pending).toBeTruthy();
});

it('Should post arguments to worker', () => {
  const { result } = renderHook(() => useWebWorkerCallback(callback));

  act(() => {
    result.current.run(1);
  });

  expect(getLastWorker().postMessage).toHaveBeenCalledWith([1]);
});

it('Should resolve with worker result', async () => {
  const { result } = renderHook(() => useWebWorkerCallback(callback));

  let promise!: Promise<number>;
  act(() => {
    promise = result.current.run(2);
  });

  act(() => {
    getLastWorker().dispatchEvent(new MessageEvent('message', { data: ['SUCCESS', 4] }));
  });

  await expect(promise).resolves.toBe(4);
  await waitFor(() => expect(result.current.pending).toBeFalsy());
});

it('Should reject with worker error', async () => {
  const { result } = renderHook(() => useWebWorkerCallback(callback));
  const error = new Error('Callback failed');

  let promise!: Promise<number>;
  act(() => {
    promise = result.current.run(2);
  });

  act(() => {
    getLastWorker().dispatchEvent(new MessageEvent('message', { data: ['ERROR', error] }));
  });

  await expect(promise).rejects.toBe(error);
  await waitFor(() => expect(result.current.pending).toBeFalsy());
});

it('Should reject when worker fails', async () => {
  const { result } = renderHook(() => useWebWorkerCallback(callback));

  let promise!: Promise<number>;
  act(() => {
    promise = result.current.run(2);
  });

  act(() => {
    getLastWorker().dispatchEvent(new ErrorEvent('error', { message: 'Worker failed' }));
  });

  await expect(promise).rejects.toBeDefined();
  await waitFor(() => expect(result.current.pending).toBeFalsy());
});

it('Should cleanup worker after settle', async () => {
  const { result } = renderHook(() => useWebWorkerCallback(callback));

  let promise!: Promise<number>;
  act(() => {
    promise = result.current.run(2);
  });

  const worker = getLastWorker();

  act(() => {
    worker.dispatchEvent(new MessageEvent('message', { data: ['SUCCESS', 4] }));
  });

  await promise;

  expect(worker.terminate).toHaveBeenCalledOnce();
  expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
});

it('Should not run callback twice', async () => {
  const { result } = renderHook(() => useWebWorkerCallback(callback));

  act(() => {
    result.current.run(1);
  });

  await expect(result.current.run(2)).rejects.toThrow('already running');
  expect(MockWorker.instances).toHaveLength(1);
});

it('Should run callback again after settle', async () => {
  const { result } = renderHook(() => useWebWorkerCallback(callback));

  let promise!: Promise<number>;
  act(() => {
    promise = result.current.run(2);
  });

  act(() => {
    getLastWorker().dispatchEvent(new MessageEvent('message', { data: ['SUCCESS', 4] }));
  });

  await promise;

  act(() => {
    result.current.run(8);
  });

  expect(MockWorker.instances).toHaveLength(2);
  expect(getLastWorker().postMessage).toHaveBeenCalledWith([8]);
});

it('Should terminate worker', () => {
  const { result } = renderHook(() => useWebWorkerCallback(callback));

  act(() => {
    result.current.run(1);
  });

  const worker = getLastWorker();

  act(result.current.terminate);

  expect(worker.terminate).toHaveBeenCalledOnce();
  expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  expect(result.current.pending).toBeFalsy();
});

it('Should not terminate worker twice', () => {
  const { result } = renderHook(() => useWebWorkerCallback(callback));

  act(() => {
    result.current.run(1);
  });

  const worker = getLastWorker();

  act(result.current.terminate);
  act(result.current.terminate);

  expect(worker.terminate).toHaveBeenCalledOnce();
});

it('Should cleanup on unmount', () => {
  const { result, unmount } = renderHook(() => useWebWorkerCallback(callback));

  act(() => {
    result.current.run(1);
  });

  const worker = getLastWorker();

  unmount();

  expect(worker.terminate).toHaveBeenCalledOnce();
  expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
});
