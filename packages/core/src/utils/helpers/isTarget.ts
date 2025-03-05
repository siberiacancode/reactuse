import type { HookTarget } from './getElement';

import { targetSymbol } from './getElement';

export const isTarget = (target: HookTarget) =>
  typeof target === 'object' && ('current' in target || target.type === targetSymbol);
