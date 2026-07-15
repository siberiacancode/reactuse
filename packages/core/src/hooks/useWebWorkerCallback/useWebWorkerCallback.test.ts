import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { renderHookServer } from '@/tests';

import { useWebWorkerCallback } from './useWebWorkerCallback';

type WorkerMessageHandler = ((event: MessageEvent) => void) | null;
type WorkerErrorHandler = ((event: ErrorEvent) => void) | null;

class MockBlob {
  constructor(
    readonly parts: BlobPart[],
    readonly options?: BlobPropertyBag
  ) {}
}

class MockWorker {
  static instances: MockWorker[] = [];

  onerror: WorkerErrorHandler = null;
  onmessage: WorkerMessageHandler = null;
  onmessageerror: WorkerMessageHandler = null;
  postMessage = vi.fn();
  terminate = vi.fn();

  constructor(readonly url: string) {
    MockWorker.instances.push(this);
  }

  emit(data: unknown) {
    this.onmessage?.({ data } as MessageEvent);
  }

  emitError(error: Error) {
    this.onerror?.({
      error,
      message: error.message,
      preventDefault: vi.fn()
    } as unknown as ErrorEvent);
  }

  emitMessageError() {
    this.onmessageerror?.({} as MessageEvent);
  }
}

const createObjectURL = vi.fn(() => 'blob:worker');
const revokeObjectURL = vi.fn();

beforeEach(() => {
  MockWorker.instances = [];
  createObjectURL.mockClear();
  revokeObjectURL.mockClear();
  vi.stubGlobal('Blob', MockBlob);
  vi.stubGlobal('Worker', MockWorker);
  Object.assign(URL, { createObjectURL, revokeObjectURL });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

it('Should use web worker callback', () => {
  const { result } = renderHook(() => useWebWorkerCallback((value: number) => value * 2));

  expect(result.current.status).toBe('idle');
  expect(result.current.callback).toBeTypeOf('function');
  expect(result.current.terminate).toBeTypeOf('function');
});

it('Should render on server side without accessing browser APIs', () => {
  vi.stubGlobal('Blob', undefined);
  vi.stubGlobal('Worker', undefined);

  const { result } = renderHookServer(() => useWebWorkerCallback((value: number) => value * 2));

  expect(result.current.status).toBe('idle');
  expect(result.current.callback).toBeTypeOf('function');
  expect(result.current.terminate).toBeTypeOf('function');
});

it('Should serialize and run a callback in a worker', async () => {
  const workerCallback = (value: number) => value * 2;
  const { result } = renderHook(() => useWebWorkerCallback(workerCallback));

  let promise!: Promise<number>;
  act(() => {
    promise = result.current.callback(21);
  });

  const worker = MockWorker.instances[0];
  const blob = createObjectURL.mock.calls[0][0] as unknown as MockBlob;
  const source = blob.parts.join('');

  expect(result.current.status).toBe('running');
  expect(source).toContain(workerCallback.toString());
  expect(worker.postMessage).toHaveBeenCalledWith([21]);

  act(() => worker.emit({ status: 'success', result: 42 }));

  await expect(promise).resolves.toBe(42);
  await waitFor(() => expect(result.current.status).toBe('success'));
  expect(worker.terminate).toHaveBeenCalledOnce();
  expect(revokeObjectURL).toHaveBeenCalledWith('blob:worker');
});

it('Should use the latest callback after rerender', async () => {
  const { result, rerender } = renderHook(
    (workerCallback: (value: number) => number) => useWebWorkerCallback(workerCallback),
    { initialProps: (value: number) => value * 2 }
  );

  rerender((value: number) => value * 3);

  let promise!: Promise<number>;
  act(() => {
    promise = result.current.callback(2);
  });

  const blob = createObjectURL.mock.calls[0][0] as unknown as MockBlob;
  expect(blob.parts.join('')).toContain('value * 3');

  act(() => MockWorker.instances[0].emit({ status: 'success', result: 6 }));
  await expect(promise).resolves.toBe(6);
});

it('Should reject worker callback errors', async () => {
  const { result } = renderHook(() =>
    useWebWorkerCallback(() => {
      throw new Error('failed');
    })
  );

  let promise!: Promise<never>;
  act(() => {
    promise = result.current.callback();
  });

  act(() =>
    MockWorker.instances[0].emit({
      status: 'error',
      error: { message: 'failed', name: 'TypeError', stack: 'stack' }
    })
  );

  await expect(promise).rejects.toMatchObject({
    message: 'failed',
    name: 'TypeError',
    stack: 'stack'
  });
  await waitFor(() => expect(result.current.status).toBe('error'));
});

it('Should revoke the object URL when worker construction fails', async () => {
  class FailingWorker {
    constructor() {
      throw new Error('construction failed');
    }
  }

  vi.stubGlobal('Worker', FailingWorker);
  const { result } = renderHook(() => useWebWorkerCallback((value: number) => value));

  await act(async () => {
    await expect(result.current.callback(1)).rejects.toThrow('construction failed');
  });

  expect(result.current.status).toBe('error');
  expect(revokeObjectURL).toHaveBeenCalledWith('blob:worker');
});

it('Should reject worker runtime errors', async () => {
  const { result } = renderHook(() => useWebWorkerCallback((value: number) => value));

  let promise!: Promise<number>;
  act(() => {
    promise = result.current.callback(1);
  });

  act(() => MockWorker.instances[0].emitError(new Error('runtime failed')));

  await expect(promise).rejects.toThrow('runtime failed');
  await waitFor(() => expect(result.current.status).toBe('error'));
});

it('Should reject unreadable worker messages', async () => {
  const { result } = renderHook(() => useWebWorkerCallback((value: number) => value));

  let promise!: Promise<number>;
  act(() => {
    promise = result.current.callback(1);
  });

  act(() => MockWorker.instances[0].emitMessageError());

  await expect(promise).rejects.toThrow('unreadable message');
  await waitFor(() => expect(result.current.status).toBe('error'));
});

it('Should reject calls when web workers are unsupported', async () => {
  vi.stubGlobal('Worker', undefined);
  const { result } = renderHook(() => useWebWorkerCallback((value: number) => value));

  await act(async () => {
    await expect(result.current.callback(1)).rejects.toThrow('not supported');
  });

  expect(result.current.status).toBe('error');
});

it('Should reject overlapping calls', async () => {
  const { result } = renderHook(() => useWebWorkerCallback((value: number) => value));

  let first!: Promise<number>;
  act(() => {
    first = result.current.callback(1);
  });

  await expect(result.current.callback(2)).rejects.toThrow('already running');

  const rejection = expect(first).rejects.toMatchObject({ name: 'AbortError' });
  act(() => result.current.terminate());
  await rejection;
});

it('Should terminate active work and reset the status', async () => {
  const { result } = renderHook(() => useWebWorkerCallback((value: number) => value));

  let promise!: Promise<number>;
  act(() => {
    promise = result.current.callback(1);
  });

  const worker = MockWorker.instances[0];
  const rejection = expect(promise).rejects.toMatchObject({ name: 'AbortError' });

  act(() => result.current.terminate());

  await rejection;
  expect(result.current.status).toBe('idle');
  expect(worker.terminate).toHaveBeenCalledOnce();
  expect(revokeObjectURL).toHaveBeenCalledWith('blob:worker');
});

it('Should cleanup active work on unmount', async () => {
  const { result, unmount } = renderHook(() => useWebWorkerCallback((value: number) => value));

  let promise!: Promise<number>;
  act(() => {
    promise = result.current.callback(1);
  });

  const worker = MockWorker.instances[0];
  const rejection = expect(promise).rejects.toMatchObject({ name: 'AbortError' });

  unmount();

  await rejection;
  expect(worker.terminate).toHaveBeenCalledOnce();
  expect(revokeObjectURL).toHaveBeenCalledWith('blob:worker');
});
