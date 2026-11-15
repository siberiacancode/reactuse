import { act, renderHook, waitFor } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';

import type {
  UseWebMCPOptions,
  WebMCPModelContextRegisterToolOptions,
  WebMCPModelContextTool,
  WebMCPToolExecuteCallback
} from './useWebMCP';

import { useWebMCP } from './useWebMCP';

const mockRegisterTool = vi.fn();
const trigger = createTrigger<string, WebMCPToolExecuteCallback>();
const registrations: Array<{
  exposedTo?: string[];
  signal: AbortSignal;
  tool: WebMCPModelContextTool;
}> = [];

const getLastRegistration = () => registrations.at(-1)!;

beforeEach(() => {
  mockRegisterTool.mockImplementation(
    (tool: WebMCPModelContextTool, options?: WebMCPModelContextRegisterToolOptions) => {
      if (!options?.signal) throw new Error('Expected registration signal');

      registrations.push({ exposedTo: options.exposedTo, signal: options.signal, tool });
      trigger.add(tool.name, tool.execute);
      return Promise.resolve();
    }
  );
  registrations.length = 0;
  trigger.clear();
  Object.defineProperty(document, 'modelContext', {
    value: { registerTool: mockRegisterTool },
    configurable: true
  });
});

it('Should use WebMCP', async () => {
  const { result } = renderHook(() =>
    useWebMCP({ name: 'get-theme', description: 'Gets the current theme', execute: vi.fn() })
  );

  expect(result.current.supported).toBeTruthy();
  expect(result.current.registered).toBeFalsy();
  expect(result.current.error).toBeUndefined();
  expect(result.current.register).toBeTypeOf('function');
  expect(result.current.unregister).toBeTypeOf('function');
  await waitFor(() => expect(result.current.registered).toBeTruthy());
});

it('Should use WebMCP on server side', () => {
  const { result } = renderHookServer(() =>
    useWebMCP({ name: 'get-theme', description: 'Gets the current theme', execute: vi.fn() })
  );

  expect(result.current.supported).toBeFalsy();
  expect(result.current.registered).toBeFalsy();
  expect(result.current.error).toBeUndefined();
  expect(result.current.register).toBeTypeOf('function');
  expect(result.current.unregister).toBeTypeOf('function');
});

it('Should use WebMCP for unsupported', async () => {
  Object.defineProperty(document, 'modelContext', {
    value: undefined,
    configurable: true
  });

  const { result } = renderHook(() =>
    useWebMCP({ name: 'get-theme', description: 'Gets the current theme', execute: vi.fn() })
  );

  expect(result.current.supported).toBeFalsy();
  expect(result.current.registered).toBeFalsy();
  expect(result.current.error).toBeUndefined();
  expect(mockRegisterTool).not.toHaveBeenCalled();
});

it('Should register tool on mount', async () => {
  const { result } = renderHook(() =>
    useWebMCP({
      annotations: { readOnlyHint: true },
      description: 'Gets a theme',
      execute: vi.fn(),
      exposedTo: ['https://example.com'],
      inputSchema: {
        type: 'object',
        properties: { theme: { type: 'string' } }
      },
      name: 'get-theme',
      title: 'Get theme'
    })
  );

  expect(getLastRegistration()).toEqual({
    exposedTo: ['https://example.com'],
    signal: expect.any(AbortSignal),
    tool: {
      annotations: { readOnlyHint: true },
      description: 'Gets a theme',
      execute: expect.any(Function),
      inputSchema: {
        type: 'object',
        properties: { theme: { type: 'string' } }
      },
      name: 'get-theme',
      title: 'Get theme'
    }
  });
  await waitFor(() => expect(result.current.registered).toBeTruthy());
});

it('Should execute registered tool', async () => {
  const execute = vi.fn().mockReturnValue({ theme: 'dark' });
  const signal = new AbortController().signal;
  const { result } = renderHook(() =>
    useWebMCP({ name: 'get-theme', description: 'Gets the current theme', execute })
  );
  await waitFor(() => expect(result.current.registered).toBeTruthy());

  const value = await trigger.callback('get-theme', { preferred: true }, { signal });

  expect(execute).toHaveBeenCalledOnce();
  expect(execute).toHaveBeenCalledWith({ preferred: true }, { signal });
  expect(value).toEqual({ theme: 'dark' });
});

it('Should execute tool with latest callback', async () => {
  const execute = vi.fn();
  const signal = new AbortController().signal;
  const { rerender, result } = renderHook(
    ({ execute }) =>
      useWebMCP({ name: 'get-theme', description: 'Gets the current theme', execute }),
    { initialProps: { execute: vi.fn() } }
  );
  await waitFor(() => expect(result.current.registered).toBeTruthy());

  rerender({ execute });
  trigger.callback('get-theme', { preferred: true }, { signal });

  expect(execute).toHaveBeenCalledWith({ preferred: true }, { signal });
});

it('Should skip immediate registration', () => {
  const { result } = renderHook(() =>
    useWebMCP({
      name: 'get-theme',
      description: 'Gets the current theme',
      execute: vi.fn(),
      immediately: false
    })
  );

  expect(result.current.registered).toBeFalsy();
  expect(mockRegisterTool).not.toHaveBeenCalled();
});

it('Should reregister tool when name changes', async () => {
  const { rerender, result } = renderHook(
    ({ name }) => useWebMCP({ description: 'Gets the current theme', execute: vi.fn(), name }),
    { initialProps: { name: 'get-theme' } }
  );
  const { signal: firstSignal } = getLastRegistration();
  await waitFor(() => expect(result.current.registered).toBeTruthy());

  rerender({ name: 'get-language' });

  expect(firstSignal.aborted).toBeTruthy();
  expect(mockRegisterTool).toHaveBeenCalledTimes(2);
  expect(getLastRegistration().tool).toEqual(expect.objectContaining({ name: 'get-language' }));
  await waitFor(() => expect(result.current.registered).toBeTruthy());
});

it('Should register tool manually with latest options', async () => {
  const initialOptions: UseWebMCPOptions = {
    name: 'get-theme',
    description: 'Old description',
    execute: vi.fn(),
    title: 'Old title'
  };
  const { rerender, result } = renderHook((options: UseWebMCPOptions) => useWebMCP(options), {
    initialProps: initialOptions
  });
  await waitFor(() => expect(result.current.registered).toBeTruthy());

  rerender({
    annotations: { readOnlyHint: true },
    name: 'get-theme',
    description: 'New description',
    execute: vi.fn(),
    exposedTo: ['https://example.com'],
    title: 'New title'
  });
  await act(result.current.register);

  expect(mockRegisterTool).toHaveBeenCalledTimes(2);
  expect(getLastRegistration().tool).toEqual(
    expect.objectContaining({
      annotations: { readOnlyHint: true },
      description: 'New description',
      title: 'New title'
    })
  );
  expect(getLastRegistration()).toEqual(
    expect.objectContaining({ exposedTo: ['https://example.com'] })
  );
});

it('Should replace registration on manual register', async () => {
  const { result } = renderHook(() =>
    useWebMCP({ name: 'get-theme', description: 'Gets the current theme', execute: vi.fn() })
  );
  const { signal: firstSignal } = getLastRegistration();
  await waitFor(() => expect(result.current.registered).toBeTruthy());

  await act(result.current.register);

  const { signal: secondSignal } = getLastRegistration();
  expect(firstSignal.aborted).toBeTruthy();
  expect(secondSignal).not.toBe(firstSignal);
  expect(secondSignal.aborted).toBeFalsy();
  expect(result.current.registered).toBeTruthy();
});

it('Should unregister tool manually', async () => {
  const { result } = renderHook(() =>
    useWebMCP({ name: 'get-theme', description: 'Gets the current theme', execute: vi.fn() })
  );
  const { signal } = getLastRegistration();
  await waitFor(() => expect(result.current.registered).toBeTruthy());

  act(result.current.unregister);

  expect(signal.aborted).toBeTruthy();
  expect(result.current.registered).toBeFalsy();
});

it('Should expose registration error', async () => {
  const error = new Error('Registration failed');
  mockRegisterTool.mockRejectedValue(error);

  const { result } = renderHook(() =>
    useWebMCP({ name: 'get-theme', description: 'Gets the current theme', execute: vi.fn() })
  );

  await waitFor(() => expect(result.current.error).toBe(error));
  expect(result.current.registered).toBeFalsy();
});

it('Should clear registration error on retry', async () => {
  mockRegisterTool
    .mockRejectedValueOnce(new Error('Registration failed'))
    .mockResolvedValueOnce(undefined);
  const { result } = renderHook(() =>
    useWebMCP({ name: 'get-theme', description: 'Gets the current theme', execute: vi.fn() })
  );
  await waitFor(() => expect(result.current.error).toBeDefined());

  await act(result.current.register);

  expect(result.current.error).toBeUndefined();
  expect(result.current.registered).toBeTruthy();
});

it('Should ignore aborted registration error', async () => {
  const registration = Promise.withResolvers<void>();
  mockRegisterTool.mockReturnValue(registration.promise);
  const { result } = renderHook(() =>
    useWebMCP({ name: 'get-theme', description: 'Gets the current theme', execute: vi.fn() })
  );

  act(result.current.unregister);
  await act(async () => {
    registration.reject(new Error('Registration failed'));
    await registration.promise.catch(() => undefined);
  });

  expect(result.current.error).toBeUndefined();
  expect(result.current.registered).toBeFalsy();
});

it('Should cleanup on unmount', () => {
  const { unmount } = renderHook(() =>
    useWebMCP({ name: 'get-theme', description: 'Gets the current theme', execute: vi.fn() })
  );
  const { signal } = getLastRegistration();

  unmount();

  expect(signal.aborted).toBeTruthy();
});
