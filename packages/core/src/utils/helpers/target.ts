import { targetSymbol } from './targetSymbol';

export type Target = (() => Element) | string | Document | Element | Window;

export const target = (target: Target) => ({
  value: target,
  type: targetSymbol
});
