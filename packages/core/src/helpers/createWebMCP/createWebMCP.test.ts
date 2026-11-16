import type {
  WebMCPModelContextRegisterToolOptions,
  WebMCPModelContextTool
} from '../../hooks/useWebMCP/useWebMCP';

import { createWebMCP } from './createWebMCP';

const mockRegisterTool = vi.fn();
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
      return Promise.resolve();
    }
  );
  registrations.length = 0;
  Object.defineProperty(document, 'modelContext', {
    value: { registerTool: mockRegisterTool },
    configurable: true
  });
});

afterEach(vi.unstubAllGlobals);

it('Should create WebMCP', () => {
  const webMCP = createWebMCP();

  expect(webMCP.supported).toBeTruthy();
  expect(webMCP.register).toBeTypeOf('function');
  expect(webMCP.unregister).toBeTypeOf('function');
  expect(webMCP.clear).toBeTypeOf('function');
});

it('Should create WebMCP on server side', () => {
  vi.stubGlobal('document', undefined);
  const webMCP = createWebMCP();

  expect(webMCP.supported).toBeFalsy();
  expect(webMCP.register).toBeTypeOf('function');
  expect(webMCP.unregister).toBeTypeOf('function');
  expect(webMCP.clear).toBeTypeOf('function');
});

it('Should create WebMCP for unsupported', () => {
  Object.defineProperty(document, 'modelContext', {
    value: undefined,
    configurable: true
  });
  const webMCP = createWebMCP();

  expect(webMCP.supported).toBeFalsy();
  expect(webMCP.register).toBeTypeOf('function');
  expect(webMCP.unregister).toBeTypeOf('function');
  expect(webMCP.clear).toBeTypeOf('function');
});

it('Should register tool', async () => {
  const webMCP = createWebMCP();
  const tool = {
    annotations: { readOnlyHint: true },
    description: 'Gets the current theme',
    execute: vi.fn(),
    inputSchema: {
      type: 'object',
      properties: { theme: { type: 'string' } }
    },
    name: 'get-theme',
    title: 'Get theme'
  };

  await expect(webMCP.register(tool, { exposedTo: ['https://example.com'] })).toBeTruthy();

  expect(getLastRegistration()).toEqual({
    exposedTo: ['https://example.com'],
    signal: expect.any(AbortSignal),
    tool
  });
});

it('Should replace registration with the same name', async () => {
  const webMCP = createWebMCP();
  const registration = Promise.withResolvers<void>();
  mockRegisterTool.mockImplementationOnce(
    (tool: WebMCPModelContextTool, options?: WebMCPModelContextRegisterToolOptions) => {
      if (!options?.signal) throw new Error('Expected registration signal');

      registrations.push({ exposedTo: options.exposedTo, signal: options.signal, tool });
      return registration.promise;
    }
  );

  const firstResult = webMCP.register({
    name: 'get-theme',
    description: 'Gets the current theme',
    execute: vi.fn()
  });
  const firstRegistration = getLastRegistration();

  const secondResult = webMCP.register({
    name: 'get-theme',
    description: 'Gets the current theme',
    execute: vi.fn()
  });
  const secondRegistration = getLastRegistration();

  await expect(secondResult).resolves.toBeTruthy();
  registration.resolve();
  await expect(firstResult).resolves.toBeFalsy();
  expect(firstRegistration.signal.aborted).toBeTruthy();
  expect(secondRegistration).not.toBe(firstRegistration);
  expect(secondRegistration.signal.aborted).toBeFalsy();
  expect(mockRegisterTool).toHaveBeenCalledTimes(2);
});

it('Should allow multiple registrations', async () => {
  const webMCP = createWebMCP();

  await expect(
    Promise.all([
      webMCP.register({
        name: 'get-theme',
        description: 'Gets the current theme',
        execute: vi.fn()
      }),
      webMCP.register({
        name: 'get-language',
        description: 'Gets the current language',
        execute: vi.fn()
      })
    ])
  ).resolves.toEqual([true, true]);

  expect(registrations).toHaveLength(2);
});

it('Should unregister tool', async () => {
  const webMCP = createWebMCP();
  const mockAbort = vi.spyOn(AbortController.prototype, 'abort');

  await webMCP.register({
    name: 'get-theme',
    description: 'Gets the current theme',
    execute: vi.fn()
  });
  const { signal } = getLastRegistration();

  webMCP.unregister('get-theme');
  webMCP.unregister('get-theme');

  expect(signal.aborted).toBeTruthy();
  expect(mockAbort).toHaveBeenCalledOnce();
});

it('Should clear registrations', async () => {
  const webMCP = createWebMCP();
  const mockAbort = vi.spyOn(AbortController.prototype, 'abort');

  await webMCP.register({
    name: 'get-theme',
    description: 'Gets the current theme',
    execute: vi.fn()
  });

  webMCP.clear();
  webMCP.clear();

  expect(registrations[0].signal.aborted).toBeTruthy();
  expect(mockAbort).toHaveBeenCalledOnce();
});
