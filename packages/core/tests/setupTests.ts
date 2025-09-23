import { TextEncoder } from 'node:util';

globalThis.TextEncoder = TextEncoder;

if (typeof document !== 'undefined') {
  const target = document.createElement('div');
  target.id = 'target';
  target.tabIndex = 0;
  document.body.appendChild(target);
}

afterEach(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
});
