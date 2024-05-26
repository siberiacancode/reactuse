import { TextEncoder } from 'util';

import '@testing-library/jest-dom/vitest';

global.TextEncoder = TextEncoder;
