import { targetSymbol } from './getElement';
export const isTarget = (target) => typeof target === 'object' && ('current' in target || target.type === targetSymbol);
