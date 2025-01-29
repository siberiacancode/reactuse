import { TextEncoder } from 'node:util';

globalThis.TextEncoder = TextEncoder;

if (typeof window !== 'undefined' && typeof window.MediaQueryListEvent === 'undefined') {
  class MockMediaQueryListEvent extends Event {
    media: string;
    matches: boolean;
    constructor(type: string, eventInitDict?: MediaQueryListEventInit) {
      super(type, eventInitDict);
      this.media = eventInitDict?.media || '';
      this.matches = eventInitDict?.matches || false;
    }
  }

  (window as any).MediaQueryListEvent = MockMediaQueryListEvent;
}

afterEach(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
});
