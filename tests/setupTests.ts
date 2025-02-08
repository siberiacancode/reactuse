import { TextEncoder } from 'node:util';

globalThis.TextEncoder = TextEncoder;

afterEach(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
});
