import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import {
  applyMaskToRaw,
  buildDisplayValue,
  checkComplete,
  consumeToMask,
  deleteBackward,
  deleteForward,
  extractRaw,
  findNextTokenIndex,
  findPrevTokenIndex,
  formatMask,
  generatePattern,
  getSlot,
  insertChar,
  isMaskComplete,
  normalizeChar,
  parseMask,
  pasteText,
  processInput,
  replaceRangeWithText,
  testPattern,
  unformatMask,
  useMask
} from './useMask';

const TOKENS = {
  '9': /\d/,
  a: /[A-Z]/i
};

let input: HTMLInputElement;

beforeEach(() => {
  input = document.createElement('input');
});

const getDateSlots = () => parseMask('99/99', TOKENS);

const applyHandlers = (handlers: ReturnType<ReturnType<typeof useMask>['register']>) => {
  handlers.ref(input);
  input.onchange = handlers.onChange as any;
  input.onfocus = handlers.onFocus as any;
  input.onblur = handlers.onBlur as any;
  input.onkeydown = handlers.onKeyDown as any;
  input.onpaste = handlers.onPaste as any;
  input.onmousedown = handlers.onMouseDown as any;
  input.onmouseup = handlers.onMouseUp as any;
};

describe('normalizeChar', () => {
  it('Should return transformed first char', () => {
    expect(normalizeChar('a', (char) => char.toUpperCase())).toBe('A');
    expect(normalizeChar('a', () => 'BC')).toBe('B');
  });

  it('Should return empty string when transform returns empty string', () => {
    expect(normalizeChar('a', () => '')).toBe('');
  });
});

describe('testPattern', () => {
  it('Should reset regexp last index before test', () => {
    const pattern = /a/g;

    expect(testPattern(pattern, 'a')).toBeTruthy();
    expect(testPattern(pattern, 'a')).toBeTruthy();
  });
});

describe('parseMask', () => {
  it('Should parse string mask', () => {
    const slots = parseMask('+99?9', TOKENS);

    expect(slots).toEqual([
      { type: 'literal', char: '+', optional: false },
      { type: 'token', char: '9', pattern: TOKENS['9'], optional: false },
      { type: 'token', char: '9', pattern: TOKENS['9'], optional: false },
      { type: 'token', char: '9', pattern: TOKENS['9'], optional: true }
    ]);
  });

  it('Should parse escaped chars and array mask', () => {
    expect(parseMask('\\999', TOKENS)).toEqual([
      { type: 'literal', char: '9' },
      { type: 'token', char: '9', pattern: TOKENS['9'], optional: false },
      { type: 'token', char: '9', pattern: TOKENS['9'], optional: false }
    ]);

    expect(parseMask(['+', /\d/], TOKENS)).toEqual([
      { type: 'literal', char: '+' },
      { type: 'token', char: '_', pattern: /\d/ }
    ]);
  });
});

describe('getSlot', () => {
  it('Should resolve slot char', () => {
    expect(getSlot(undefined, 0)).toBe('');
    expect(getSlot(null, 0)).toBe('');
    expect(getSlot('', 0)).toBe('');
    expect(getSlot('_', 5)).toBe('_');
    expect(getSlot('abcd', 2)).toBe('c');
    expect(getSlot('abcd', 10)).toBe('');
  });
});

describe('consumeToMask', () => {
  it('Should consume raw value to mask', () => {
    expect(
      consumeToMask('1234', getDateSlots(), {
        consumeMatchingLiterals: false
      })
    ).toBe('12/34');
  });

  it('Should consume matching literals from input value', () => {
    expect(
      consumeToMask('12/34', getDateSlots(), {
        consumeMatchingLiterals: true
      })
    ).toBe('12/34');
  });

  it('Should transform chars before matching', () => {
    const slots = parseMask('AA', {
      A: /[A-Z]/
    });

    expect(
      consumeToMask('ab', slots, {
        transform: (char) => char.toUpperCase(),
        consumeMatchingLiterals: false
      })
    ).toBe('AB');
  });
});

describe('applyMaskToRaw', () => {
  it('Should apply mask to raw value', () => {
    expect(applyMaskToRaw('1234', getDateSlots())).toBe('12/34');
  });

  it('Should skip invalid raw chars', () => {
    expect(applyMaskToRaw('a1b2', parseMask('99', TOKENS))).toBe('12');
  });
});

describe('processInput', () => {
  it('Should process input value with existing literals', () => {
    expect(processInput('12/34', getDateSlots())).toBe('12/34');
  });
});

describe('buildDisplayValue', () => {
  it('Should build display value with slots', () => {
    expect(buildDisplayValue('12', getDateSlots(), '_', true)).toBe('12/__');
  });

  it('Should return processed value when slots are hidden', () => {
    expect(buildDisplayValue('12', getDateSlots(), '_', false)).toBe('12');
  });
});

describe('extractRaw', () => {
  it('Should extract valid raw chars from token slots', () => {
    expect(extractRaw('1_/3a', getDateSlots())).toBe('13');
  });
});

describe('checkComplete', () => {
  it('Should check required token slots', () => {
    expect(checkComplete('12/34', getDateSlots())).toBeTruthy();
    expect(checkComplete('12/3', getDateSlots())).toBeFalsy();
  });

  it('Should ignore optional token slots', () => {
    expect(checkComplete('12', parseMask('99?9', TOKENS))).toBeTruthy();
  });
});

describe('findNextTokenIndex', () => {
  it('Should find next token index', () => {
    expect(findNextTokenIndex(getDateSlots(), 2)).toBe(3);
    expect(findNextTokenIndex(getDateSlots(), 5)).toBe(5);
  });
});

describe('findPrevTokenIndex', () => {
  it('Should find previous token index', () => {
    expect(findPrevTokenIndex(getDateSlots(), 2)).toBe(1);
    expect(findPrevTokenIndex(getDateSlots(), 0)).toBe(0);
    expect(findPrevTokenIndex(getDateSlots(), -1)).toBe(-1);
  });
});

describe('replaceRangeWithText', () => {
  it('Should replace processed range with raw text', () => {
    expect(replaceRangeWithText('12/34', getDateSlots(), 3, 5, '9')).toBe('12/9');
  });
});

describe('deleteBackward', () => {
  it('Should delete previous token', () => {
    expect(deleteBackward('12/34', getDateSlots(), 5, 5, false)).toEqual({
      value: '12/3',
      cursor: 4
    });
  });
});

describe('deleteForward', () => {
  it('Should delete next token', () => {
    expect(deleteForward('12/34', getDateSlots(), 3, 3)).toEqual({
      value: '12/4',
      cursor: 3
    });
  });
});

describe('insertChar', () => {
  it('Should insert char into next token slot', () => {
    expect(insertChar('12/4', getDateSlots(), 3, 3, '3')).toEqual({
      value: '12/34',
      cursor: 4
    });
  });
});

describe('pasteText', () => {
  it('Should paste text into processed range', () => {
    expect(pasteText('', getDateSlots(), 0, 0, '1234')).toEqual({
      value: '12/34',
      cursor: 5
    });
  });
});

describe('formatMask', () => {
  it('Should format raw value', () => {
    expect(formatMask('1234', { mask: '99/99' })).toBe('12/34');
  });
});

describe('unformatMask', () => {
  it('Should unformat masked value', () => {
    expect(unformatMask('12/34', { mask: '99/99' })).toBe('1234');
  });
});

describe('isMaskComplete', () => {
  it('Should check masked value completeness', () => {
    expect(isMaskComplete('12/34', { mask: '99/99' })).toBeTruthy();
    expect(isMaskComplete('12/3', { mask: '99/99' })).toBeFalsy();
  });
});

describe('generatePattern', () => {
  it('Should generate full pattern', () => {
    expect(generatePattern('full', { mask: '99/99' })).toBe('(\\d)(\\d)/(\\d)(\\d)');
  });

  it('Should generate full inexact pattern', () => {
    expect(generatePattern('full-inexact', { mask: '99?9' })).toBe('\\d\\d\\d?');
  });
});

it('Should use mask', () => {
  const { result } = renderHook(() => useMask({ mask: '99/99' }));

  expect(result.current.filled).toBeFalsy();
  expect(result.current.rawValue).toBe('');
  expect(result.current.displayValue).toBe('');
  expect(result.current.maskedValue).toBe('');
  expect(result.current.value).toBe('');
  expect(result.current.register).toBeTypeOf('function');
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.reset).toBeTypeOf('function');
  expect(result.current.watch).toBeTypeOf('function');
});

it('Should use mask on server side', () => {
  const { result } = renderHookServer(() => useMask({ mask: '99/99' }));

  expect(result.current.filled).toBeFalsy();
  expect(result.current.rawValue).toBe('');
  expect(result.current.displayValue).toBe('');
  expect(result.current.maskedValue).toBe('');
  expect(result.current.value).toBe('');
  expect(result.current.register).toBeTypeOf('function');
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.reset).toBeTypeOf('function');
  expect(result.current.watch).toBeTypeOf('function');
});

it('Should register input', () => {
  const { result } = renderHook(() => useMask({ mask: '99/99' }));

  act(() => applyHandlers(result.current.register()));
  act(() => result.current.watch());
  act(() => result.current.set('1234'));

  expect(input.value).toBe('12/34');
  expect(result.current.rawValue).toBe('1234');
  expect(result.current.displayValue).toBe('12/34');
  expect(result.current.maskedValue).toBe('12/34');
  expect(result.current.value).toBe('12/34');
  expect(result.current.filled).toBeTruthy();
});

it('Should handle input change from register', () => {
  const { result } = renderHook(() => useMask({ mask: '99/99' }));

  act(() => applyHandlers(result.current.register()));
  act(() => result.current.watch());

  act(() => {
    input.value = '1234';
    input.dispatchEvent(new Event('change'));
  });

  expect(input.value).toBe('12/34');
  expect(result.current.rawValue).toBe('1234');
});

it('Should rerender values only after watch', () => {
  let renders = 0;
  const { result } = renderHook(() => {
    renders++;
    return useMask({ mask: '99/99' });
  });

  act(() => applyHandlers(result.current.register()));

  act(() => {
    input.value = '1234';
    input.dispatchEvent(new Event('change'));
  });

  expect(input.value).toBe('12/34');
  expect(result.current.rawValue).toBe('');
  expect(renders).toBe(1);
  expect(result.current.watch().rawValue).toBe('1234');

  act(() => {
    input.value = '12';
    input.dispatchEvent(new Event('change'));
  });

  expect(result.current.rawValue).toBe('12');
  expect(renders).toBe(2);
});

it('Should call register params handlers', () => {
  const onChange = vi.fn();
  const onBlur = vi.fn();
  const { result } = renderHook(() => useMask({ mask: '99/99' }));

  act(() => applyHandlers(result.current.register({ onBlur, onChange })));

  act(() => {
    input.value = '1234';
    input.dispatchEvent(new Event('change'));
  });
  act(() => input.dispatchEvent(new Event('blur')));

  expect(onChange).toHaveBeenCalledOnce();
  expect(onBlur).toHaveBeenCalledOnce();
  expect(input.value).toBe('12/34');
});

it('Should show mask slots always', () => {
  const { result } = renderHook(() => useMask({ mask: '99/99', showMask: 'always', slot: '_' }));

  act(() => result.current.watch());
  act(() => applyHandlers(result.current.register()));

  expect(input.value).toBe('__/__');
  expect(result.current.displayValue).toBe('__/__');
  expect(result.current.maskedValue).toBe('');
  expect(result.current.value).toBe('__/__');
});

it('Should show mask slots on focus by default', () => {
  const { result } = renderHook(() => useMask({ mask: '99/99', slot: '_' }));

  act(() => applyHandlers(result.current.register()));
  act(() => input.dispatchEvent(new Event('focus')));

  expect(input.value).toBe('__/__');

  act(() => input.dispatchEvent(new Event('blur')));

  expect(input.value).toBe('');
});

it('Should show mask slots when value is filled', () => {
  const { result } = renderHook(() => useMask({ mask: '99/99', showMask: 'filled', slot: '_' }));

  act(() => applyHandlers(result.current.register()));
  act(() => result.current.watch());

  act(() => {
    input.value = '12';
    input.dispatchEvent(new Event('change'));
  });

  expect(input.value).toBe('12/__');
  expect(result.current.displayValue).toBe('12/__');
  expect(result.current.maskedValue).toBe('12/');
});

it('Should never show mask slots', () => {
  const { result } = renderHook(() => useMask({ mask: '99/99', showMask: 'never' }));

  act(() => applyHandlers(result.current.register()));
  act(() => input.dispatchEvent(new Event('focus')));

  expect(input.value).toBe('');
});

it('Should reset mask state', () => {
  const { result } = renderHook(() => useMask({ mask: '99/99' }));

  act(() => applyHandlers(result.current.register()));
  act(() => result.current.watch());
  act(() => result.current.set('1234'));
  act(() => result.current.reset());

  expect(input.value).toBe('');
  expect(result.current.rawValue).toBe('');
  expect(result.current.displayValue).toBe('');
  expect(result.current.maskedValue).toBe('');
  expect(result.current.value).toBe('');
  expect(result.current.filled).toBeFalsy();
});

it('Should reset with current display value in raw change callback', () => {
  const onChangeRaw = vi.fn();
  const { result } = renderHook(() =>
    useMask({ mask: '99/99', showMask: 'always', slot: '_', onChangeRaw })
  );

  act(() => applyHandlers(result.current.register()));
  act(() => result.current.watch());
  act(() => result.current.set('1234'));
  onChangeRaw.mockClear();
  act(() => result.current.reset());

  expect(input.value).toBe('__/__');
  expect(result.current.displayValue).toBe('__/__');
  expect(result.current.maskedValue).toBe('');
  expect(onChangeRaw).toHaveBeenCalledWith('', '__/__');
});

it('Should auto clear incomplete value on blur', () => {
  const { result } = renderHook(() => useMask({ mask: '99/99', autoClear: true }));

  act(() => applyHandlers(result.current.register()));

  act(() => {
    input.value = '12';
    input.dispatchEvent(new Event('change'));
  });
  act(() => input.dispatchEvent(new Event('blur')));

  expect(input.value).toBe('');
  expect(result.current.rawValue).toBe('');
});

it('Should auto clear with current display value in raw change callback', () => {
  const onChangeRaw = vi.fn();
  const { result } = renderHook(() =>
    useMask({ mask: '99/99', autoClear: true, showMask: 'always', slot: '_', onChangeRaw })
  );

  act(() => applyHandlers(result.current.register()));
  act(() => result.current.watch());

  act(() => {
    input.value = '12';
    input.dispatchEvent(new Event('change'));
  });
  onChangeRaw.mockClear();
  act(() => input.dispatchEvent(new Event('blur')));

  expect(input.value).toBe('__/__');
  expect(result.current.rawValue).toBe('');
  expect(result.current.displayValue).toBe('__/__');
  expect(result.current.maskedValue).toBe('');
  expect(onChangeRaw).toHaveBeenCalledWith('', '__/__');
});
