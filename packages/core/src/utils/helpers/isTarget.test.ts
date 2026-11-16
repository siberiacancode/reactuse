import type { HookTarget } from './isTarget';

import { isBrowserTarget, isRef, isRefState, isTarget, target, targetSymbol } from './isTarget';

const createRefState = (element: Element) =>
  Object.assign(vi.fn(), {
    current: element,
    state: element
  });

const element = document.getElementById('target') as HTMLDivElement;
const targets = [
  target('#target'),
  target(element),
  target(() => element),
  { current: element },
  createRefState(element)
];

it('Should wrap a browser target', () => {
  const wrappedTarget = target('#target');

  expect(wrappedTarget).toStrictEqual({
    type: targetSymbol,
    value: '#target'
  });
  expect(isTarget.wrap).toBe(target);
});

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should identify a supported target', () => {
      expect(isTarget(target)).toBe(true);
    });

    it('Should resolve the target element', () => {
      expect(isTarget.getElement(target)).toBe(element);
    });
  });
});

it('Should identify each target category', () => {
  expect(isBrowserTarget(target(element))).toBe(true);
  expect(isRef({ current: element })).toBe(true);
  expect(isRefState(createRefState(element))).toBe(true);
});

it('Should reject unsupported target values', () => {
  const values = [
    {},
    { type: Symbol('target'), value: document.body },
    { type: targetSymbol },
    () => document.body
  ] as unknown as HookTarget[];

  values.forEach((value) => expect(isTarget(value)).toBe(false));
});

it('Should return document and window targets', () => {
  expect(isTarget.getElement(target(document))).toBe(document);
  expect(isTarget.getElement(target(window))).toBe(window);
});

it('Should return state from a state ref', () => {
  const refState = createRefState(element);

  expect(isTarget.getRefState(refState)).toBe(element);
  expect(isTarget.getRefState({ current: element })).toBe(false);
  expect(isTarget.getRefState()).toBeUndefined();
});

it('Should return the raw value for each target type', () => {
  const ref = { current: element };
  const refState = createRefState(element);
  const browserTarget = target(element);

  expect(isTarget.getRawElement(refState)).toBe(element);
  expect(isTarget.getRawElement(browserTarget)).toBe(element);
  expect(isTarget.getRawElement(ref)).toBe(ref);
});
