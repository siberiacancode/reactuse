import type { HookTarget, Target } from './getElement';

export const targetSymbol = Symbol('target');

export const target = (target: Target) => ({
  value: target,
  type: targetSymbol
});

export const isTarget = (target: HookTarget) =>
  typeof target === 'object' &&
  ('current' in target || (target && (target as any).type === targetSymbol));

isTarget.wrap = target;
