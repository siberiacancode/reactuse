import type {
  ChangeEventHandler,
  ClipboardEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler
} from 'react';

import { useRef } from 'react';

import { useRerender } from '../useRerender/useRerender';

const DEFAULT_TOKENS: Record<string, RegExp> = {
  '9': /\d/,
  a: /[A-Z]/i,
  A: /[A-Z]/,
  '*': /[A-Z0-9]/i,
  '#': /[-+0-9]/
};

/** The use mask options type */
export interface UseMaskOptions {
  /** Clear value on blur when mask is incomplete */
  autoClear?: boolean;
  /** Mask pattern string or array of string literals and RegExp objects */
  mask: string | Array<string | RegExp>;
  /** Defines when mask slots are displayed */
  showMask?: UseMaskShow;
  /** Character displayed in unfilled slot */
  slot?: string;
  /** Override or extend the default token map */
  tokens?: Record<string, RegExp>;
  /** Escape hatch for advanced cursor/value manipulation */
  beforeMaskedChange?: (states: {
    previousState: MaskState;
    currentState: MaskState;
    nextState: MaskState;
  }) => MaskState;
  /** Called before masking on each keystroke, can return overrides for mask options */
  modify?: (
    value: string
  ) => Partial<Pick<UseMaskOptions, 'mask' | 'showMask' | 'slot' | 'tokens'>>;
  /** Called on every change with raw and masked values */
  onChangeRaw?: (rawValue: string, maskedValue: string) => void;
  /** Called when all required mask slots are filled */
  onFilled?: (maskedValue: string, rawValue: string) => void;
  /** Transform each character before validation and insertion */
  transform?: (char: string) => string;
}

/** The mask state type */
export interface MaskState {
  selection: { start: number; end: number } | null;
  value: string;
}

/** The use mask register params type */
export interface UseMaskRegisterParams {
  /** The blur event handler */
  onBlur?: FocusEventHandler<HTMLInputElement>;
  /** The change event handler */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** The focus event handler */
  onFocus?: FocusEventHandler<HTMLInputElement>;
  /** The key down event handler */
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  /** The mouse down event handler */
  onMouseDown?: MouseEventHandler<HTMLInputElement>;
  /** The mouse up event handler */
  onMouseUp?: MouseEventHandler<HTMLInputElement>;
  /** The paste event handler */
  onPaste?: ClipboardEventHandler<HTMLInputElement>;
}

/** The use mask show type */
export type UseMaskShow = 'always' | 'filled' | 'focus' | 'never';

/** The use mask return type */
export interface UseMaskValue {
  /** Current value displayed in the input */
  displayValue: string;
  /** Whether all required mask slots are filled */
  filled: boolean;
  /** Current masked value without placeholder slots */
  maskedValue: string;
  /** Current raw unmasked value */
  rawValue: string;
  /** Current value displayed in the input */
  value: string;
}

/** The use mask return type */
export interface UseMaskReturn extends UseMaskValue {
  /** Register the masked input */
  register: (params?: UseMaskRegisterParams) => UseMaskRegisterParams & {
    ref: (node: HTMLInputElement | null | undefined) => void;
  };
  /** Clear the input value and reset state */
  reset: () => void;
  /** Set the raw input value */
  set: (value: string) => void;
  /** The watch function */
  watch: () => UseMaskValue;
}

export type UseMaskReturnValue = UseMaskReturn;

interface MaskLiteralSlot {
  char: string;
  optional?: boolean;
  type: 'literal';
}

interface MaskTokenSlot {
  char: string;
  optional?: boolean;
  pattern: RegExp;
  type: 'token';
}

export type MaskSlot = MaskLiteralSlot | MaskTokenSlot;

interface UndoState {
  rawValue: string;
  selectionStart: number;
}

const MAX_UNDO_HISTORY = 100;

const shouldShowMask = (showMask: UseMaskShow, focused: boolean, processedValue: string) => {
  if (showMask === 'always') {
    return true;
  }

  if (showMask === 'focus') {
    return focused;
  }

  if (showMask === 'filled') {
    return processedValue.length > 0;
  }

  return false;
};

export const normalizeChar = (char: string, transform?: (char: string) => string) => {
  const transformed = transform ? transform(char) : char;

  return transformed[0] ?? '';
};

export const testPattern = (pattern: RegExp, char: string) => {
  pattern.lastIndex = 0;

  return pattern.test(char);
};

export const parseMask = (
  mask: string | Array<string | RegExp>,
  tokens: Record<string, RegExp>
) => {
  if (Array.isArray(mask)) {
    return mask.map((item): MaskSlot => {
      if (item instanceof RegExp) {
        return { type: 'token', char: '_', pattern: item };
      }

      return { type: 'literal', char: item };
    });
  }

  const slots: MaskSlot[] = [];
  let isOptionalTail = false;

  for (let index = 0; index < mask.length; index++) {
    const char = mask[index];

    if (char === '\\' && index + 1 < mask.length) {
      index++;
      slots.push({ type: 'literal', char: mask[index] });
      continue;
    }

    if (char === '?') {
      isOptionalTail = true;
      continue;
    }

    const pattern = tokens[char];

    if (pattern) {
      slots.push({
        type: 'token',
        char,
        pattern,
        optional: isOptionalTail
      });
      continue;
    }

    slots.push({
      type: 'literal',
      char,
      optional: isOptionalTail
    });
  }

  return slots;
};

export const getSlot = (slot: string | null | undefined, index: number) => {
  if (!slot) {
    return '';
  }

  if (slot.length === 1) {
    return slot;
  }

  return slot[index] ?? '';
};

export const consumeToMask = (
  inputValue: string,
  slots: MaskSlot[],
  options: {
    consumeMatchingLiterals: boolean;
    transform?: (char: string) => string;
  }
) => {
  let result = '';
  let inputIndex = 0;

  for (const slot of slots) {
    if (slot.type === 'literal') {
      result += slot.char;

      if (options.consumeMatchingLiterals && inputValue[inputIndex] === slot.char) {
        inputIndex++;
      }

      continue;
    }

    let matched = false;

    while (inputIndex < inputValue.length) {
      const char = normalizeChar(inputValue[inputIndex], options.transform);
      inputIndex++;

      if (testPattern(slot.pattern, char)) {
        result += char;
        matched = true;
        break;
      }
    }

    if (!matched) {
      break;
    }
  }

  return result;
};

export const applyMaskToRaw = (
  rawValue: string,
  slots: MaskSlot[],
  transform?: (char: string) => string
) =>
  consumeToMask(rawValue, slots, {
    transform,
    consumeMatchingLiterals: false
  });

export const processInput = (
  inputValue: string,
  slots: MaskSlot[],
  transform?: (char: string) => string
) =>
  consumeToMask(inputValue, slots, {
    transform,
    consumeMatchingLiterals: true
  });

export const buildDisplayValue = (
  processedValue: string,
  slots: MaskSlot[],
  slotValue: string | null | undefined,
  showSlots: boolean
) => {
  if (!showSlots) {
    return processedValue;
  }

  let displayValue = processedValue;

  for (let index = processedValue.length; index < slots.length; index++) {
    const slot = slots[index];

    if (slot.type === 'literal') {
      displayValue += slot.char;
      continue;
    }

    const char = getSlot(slotValue, index);

    if (!char) {
      break;
    }

    displayValue += char;
  }

  return displayValue;
};

export const extractRaw = (maskedValue: string, slots: MaskSlot[]) => {
  let rawValue = '';

  for (let index = 0; index < maskedValue.length && index < slots.length; index++) {
    const slot = slots[index];
    const char = maskedValue[index];

    if (slot.type === 'token' && testPattern(slot.pattern, char)) {
      rawValue += char;
    }
  }

  return rawValue;
};

export const checkComplete = (maskedValue: string, slots: MaskSlot[]) => {
  for (let index = 0; index < slots.length; index++) {
    const slot = slots[index];

    if (slot.type !== 'token' || slot.optional) {
      continue;
    }

    const char = maskedValue[index];

    if (!char || !testPattern(slot.pattern, char)) {
      return false;
    }
  }

  return true;
};

export const findNextTokenIndex = (slots: MaskSlot[], from: number) => {
  for (let index = from; index < slots.length; index++) {
    if (slots[index].type === 'token') {
      return index;
    }
  }

  return slots.length;
};

export const findPrevTokenIndex = (slots: MaskSlot[], from: number) => {
  for (let index = from; index >= 0; index--) {
    if (slots[index].type === 'token') {
      return index;
    }
  }

  return -1;
};

const getResolvedOptions = (options: UseMaskOptions, rawValue: string) => {
  const tokens = { ...DEFAULT_TOKENS, ...options.tokens };
  let mask = options.mask;
  let showMask = options.showMask ?? 'focus';
  let slot: string | undefined = options.slot === undefined ? ' ' : options.slot;

  const overrides = options.modify?.(rawValue);

  if (overrides) {
    if (overrides.mask) {
      mask = overrides.mask;
    }

    if (overrides.tokens) {
      Object.assign(tokens, overrides.tokens);
    }

    if (overrides.slot) {
      slot = overrides.slot;
    }

    if (overrides.showMask) {
      showMask = overrides.showMask;
    }
  }

  return {
    slots: parseMask(mask, tokens),
    showMask,
    slot,
    transform: options.transform
  };
};

const getInputSelection = (input: HTMLInputElement | null) => {
  if (!input) {
    return null;
  }

  const start = input.selectionStart;
  const end = input.selectionEnd;

  if (start === null || end === null) {
    return null;
  }

  return { start, end };
};

const findNextEditablePosition = (from: number, slots: MaskSlot[]) => {
  let position = from;

  while (position < slots.length && slots[position]?.type === 'literal') {
    position++;
  }

  return position;
};

export const replaceRangeWithText = (
  processedValue: string,
  slots: MaskSlot[],
  start: number,
  end: number,
  text: string,
  transform?: (char: string) => string
) => {
  const beforeRawValue = extractRaw(processedValue.slice(0, start), slots.slice(0, start));
  const afterRawValue = extractRaw(processedValue.slice(end), slots.slice(end));

  return applyMaskToRaw(beforeRawValue + text + afterRawValue, slots, transform);
};

export const deleteBackward = (
  processedValue: string,
  slots: MaskSlot[],
  start: number,
  end: number,
  modifier: boolean,
  transform?: (char: string) => string
) => {
  if (modifier) {
    const clampedStart = Math.min(start, processedValue.length);

    return {
      value: replaceRangeWithText(processedValue, slots, 0, clampedStart, '', transform),
      cursor: 0
    };
  }

  if (start !== end) {
    const clampedEnd = Math.min(end, processedValue.length);

    return {
      value: replaceRangeWithText(processedValue, slots, start, clampedEnd, '', transform),
      cursor: start
    };
  }

  if (start === 0) {
    return null;
  }

  let deletePosition = start - 1;
  while (deletePosition >= 0 && slots[deletePosition]?.type === 'literal') {
    deletePosition--;
  }

  if (deletePosition < 0) {
    return null;
  }

  return {
    value: replaceRangeWithText(
      processedValue,
      slots,
      deletePosition,
      deletePosition + 1,
      '',
      transform
    ),
    cursor: deletePosition
  };
};

export const deleteForward = (
  processedValue: string,
  slots: MaskSlot[],
  start: number,
  end: number,
  transform?: (char: string) => string
) => {
  if (start !== end) {
    const clampedEnd = Math.min(end, processedValue.length);

    return {
      value: replaceRangeWithText(processedValue, slots, start, clampedEnd, '', transform),
      cursor: start
    };
  }

  let deletePosition = start;
  while (deletePosition < slots.length && slots[deletePosition]?.type === 'literal') {
    deletePosition++;
  }

  if (deletePosition >= processedValue.length) {
    return null;
  }

  return {
    value: replaceRangeWithText(processedValue, slots, start, deletePosition + 1, '', transform),
    cursor: start
  };
};

export const insertChar = (
  processedValue: string,
  slots: MaskSlot[],
  start: number,
  end: number,
  char: string,
  transform?: (char: string) => string
) => {
  let insertPosition = Math.min(start, processedValue.length);
  while (insertPosition < slots.length && slots[insertPosition]?.type === 'literal') {
    insertPosition++;
  }

  if (insertPosition >= slots.length) {
    return null;
  }

  const slot = slots[insertPosition];
  if (slot.type !== 'token') {
    return null;
  }

  const normalizedChar = normalizeChar(char, transform);
  if (!testPattern(slot.pattern, normalizedChar)) {
    return null;
  }

  return {
    value: replaceRangeWithText(
      processedValue,
      slots,
      insertPosition,
      start < end ? Math.min(end, processedValue.length) : insertPosition,
      normalizedChar,
      transform
    ),
    cursor: findNextEditablePosition(insertPosition + 1, slots)
  };
};

export const pasteText = (
  processedValue: string,
  slots: MaskSlot[],
  start: number,
  end: number,
  text: string,
  transform?: (char: string) => string
) => {
  const clampedStart = Math.min(start, processedValue.length);
  const clampedEnd = Math.min(end, processedValue.length);
  const beforeRawValue = extractRaw(
    processedValue.slice(0, clampedStart),
    slots.slice(0, clampedStart)
  );
  const maskedPrefix = applyMaskToRaw(beforeRawValue + text, slots, transform);

  return {
    value: replaceRangeWithText(processedValue, slots, clampedStart, clampedEnd, text, transform),
    cursor: Math.min(maskedPrefix.length, slots.length)
  };
};

export const formatMask = (rawValue: string, options: UseMaskOptions) => {
  const { slots, transform } = getResolvedOptions(options, rawValue);

  return applyMaskToRaw(rawValue, slots, transform);
};

export const unformatMask = (maskedValue: string, options: UseMaskOptions) => {
  const { slots } = getResolvedOptions(options, '');

  return extractRaw(maskedValue, slots);
};

export const isMaskComplete = (maskedValue: string, options: UseMaskOptions) => {
  const { slots } = getResolvedOptions(options, '');

  return checkComplete(maskedValue, slots);
};

export const generatePattern = (mode: 'full-inexact' | 'full', options: UseMaskOptions) => {
  const { slots } = getResolvedOptions(options, '');
  let pattern = '';

  for (const slot of slots) {
    if (slot.type === 'literal') {
      pattern += slot.char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      continue;
    }

    const source = slot.pattern.source;

    if (mode === 'full-inexact') {
      pattern += slot.optional ? `${source}?` : source;
      continue;
    }

    pattern += slot.optional ? `(${source})?` : `(${source})`;
  }

  return pattern;
};

/**
 * @name useMask
 * @description - Hook to apply an input mask
 * @category State
 * @usage medium
 *
 * @param {UseMaskOptions} options The hook options
 * @param {boolean} [options.autoClear=false] Clear value on blur when mask is incomplete
 * @param {string | Array<string | RegExp>} options.mask Mask pattern string or array of literals and RegExp tokens
 * @param {(value: string) => Partial<Pick<UseMaskOptions, 'mask' | 'showMask' | 'slot' | 'tokens'>>} [options.modify] Called before masking and can return dynamic mask option overrides
 * @param {UseMaskShow} [options.showMask="focus"] Defines when placeholder slots are displayed
 * @param {string | null} [options.slot=""] Character displayed in unfilled slots
 * @param {Record<string, RegExp>} [options.tokens] Override or extend the default token map
 * @param {(states: { previousState: MaskState; currentState: MaskState; nextState: MaskState }) => MaskState} [options.beforeMaskedStateChange] Escape hatch for advanced cursor/value manipulation
 * @param {(rawValue: string, maskedValue: string) => void} [options.onChangeRaw] Called on every change with raw and display values
 * @param {(maskedValue: string, rawValue: string) => void} [options.onFilled] Called when all required mask slots are filled
 * @param {(char: string) => string} [options.transform] Transform each character before validation and insertion
 * @returns {UseMaskReturn} An object with the masked input state
 *
 * @example
 * const phoneMask = useMask({ mask: '+7 (999) 999-99-99' });
 */
export const useMask = (options: UseMaskOptions): UseMaskReturn => {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const valueRef = useRef<UseMaskValue>({
    displayValue: '',
    filled: false,
    maskedValue: '',
    rawValue: '',
    value: ''
  });

  const processedRef = useRef('');
  const displayValueRef = useRef('');
  const rawValueRef = useRef('');
  const wasCompleteRef = useRef(false);
  const isFocusedRef = useRef(false);
  const watchingRef = useRef(false);
  const undoStackRef = useRef<UndoState[]>([]);
  const redoStackRef = useRef<UndoState[]>([]);
  const rerender = useRerender();

  const updateRefs = (value: Partial<Omit<UseMaskValue, 'value'>>) => {
    const displayValue = value.displayValue ?? valueRef.current.displayValue;

    valueRef.current = {
      displayValue,
      value: displayValue,
      filled: value.filled ?? valueRef.current.filled,
      maskedValue: value.maskedValue ?? valueRef.current.maskedValue,
      rawValue: value.rawValue ?? valueRef.current.rawValue
    };

    if (watchingRef.current) rerender();
  };

  const updateValue = (nextMaskedValue: string, cursorPosition?: number) => {
    const hookOptions = optionsRef.current;
    const initialSlots = getResolvedOptions(hookOptions, '').slots;
    const initialRawValue = extractRaw(nextMaskedValue, initialSlots);
    const initialOptions = getResolvedOptions(hookOptions, initialRawValue);

    const initialProcessedValue = processInput(
      nextMaskedValue,
      initialOptions.slots,
      initialOptions.transform
    );
    const nextRawValue = extractRaw(initialProcessedValue, initialOptions.slots);
    const resolvedOptions = getResolvedOptions(hookOptions, nextRawValue);
    const processedValue = processInput(
      nextMaskedValue,
      resolvedOptions.slots,
      resolvedOptions.transform
    );
    const nextDisplayValue = buildDisplayValue(
      processedValue,
      resolvedOptions.slots,
      resolvedOptions.slot,
      shouldShowMask(resolvedOptions.showMask, isFocusedRef.current, processedValue)
    );
    const previousState = {
      value: displayValueRef.current,
      selection: getInputSelection(inputRef.current)
    };
    const currentState = {
      value: inputRef.current?.value ?? nextMaskedValue,
      selection: getInputSelection(inputRef.current)
    };
    const nextState = {
      value: nextDisplayValue,
      selection:
        cursorPosition === undefined
          ? getInputSelection(inputRef.current)
          : {
              start: Math.min(cursorPosition, processedValue.length),
              end: Math.min(cursorPosition, processedValue.length)
            }
    };

    const maskedState = hookOptions.beforeMaskedChange
      ? hookOptions.beforeMaskedChange({
          previousState,
          currentState,
          nextState
        })
      : nextState;
    const nextInputValue = maskedState.value;
    const finalProcessedValue = processInput(
      nextInputValue,
      resolvedOptions.slots,
      resolvedOptions.transform
    );
    const finalRawValue = extractRaw(finalProcessedValue, resolvedOptions.slots);
    const finalMaskedValue = applyMaskToRaw(
      finalRawValue,
      resolvedOptions.slots,
      resolvedOptions.transform
    );
    const complete = checkComplete(finalMaskedValue, resolvedOptions.slots);

    processedRef.current = finalMaskedValue;
    displayValueRef.current = nextInputValue;
    rawValueRef.current = finalRawValue;
    updateRefs({
      displayValue: nextInputValue,
      filled: complete,
      maskedValue: finalMaskedValue,
      rawValue: finalRawValue
    });

    if (inputRef.current) {
      inputRef.current.value = nextInputValue;

      if (maskedState.selection && document.activeElement === inputRef.current) {
        inputRef.current.setSelectionRange(maskedState.selection.start, maskedState.selection.end);
      }
    }

    hookOptions.onChangeRaw?.(finalRawValue, nextInputValue);

    if (complete && !wasCompleteRef.current) {
      hookOptions.onFilled?.(nextInputValue, finalRawValue);
    }

    wasCompleteRef.current = complete;
  };

  const pushUndoState = () => {
    const state: UndoState = {
      rawValue: rawValueRef.current,
      selectionStart: inputRef.current?.selectionStart ?? rawValueRef.current.length
    };
    const stack = undoStackRef.current;
    const top = stack[stack.length - 1];

    if (top && top.rawValue === state.rawValue && top.selectionStart === state.selectionStart) {
      return;
    }

    stack.push(state);

    if (stack.length > MAX_UNDO_HISTORY) {
      stack.shift();
    }

    redoStackRef.current = [];
  };

  const applyHistoryState = (state: UndoState) => {
    const { slots, transform } = getResolvedOptions(optionsRef.current, state.rawValue);
    const nextMaskedValue = applyMaskToRaw(state.rawValue, slots, transform);

    updateValue(nextMaskedValue, state.selectionStart);
  };

  const set = (value: string) => {
    const { slots, transform } = getResolvedOptions(optionsRef.current, value);
    const nextMaskedValue = applyMaskToRaw(value, slots, transform);

    updateValue(nextMaskedValue);
  };

  const clampCursorToProcessed = (element: HTMLInputElement) => {
    const start = element.selectionStart ?? 0;
    const end = element.selectionEnd ?? 0;

    if (start !== end) {
      return;
    }

    const { slots } = getResolvedOptions(optionsRef.current, rawValueRef.current);
    const processedValue = processedRef.current;
    const endPosition =
      processedValue.length > 0
        ? findNextEditablePosition(processedValue.length, slots)
        : findNextTokenIndex(slots, 0);
    const startPosition = findNextTokenIndex(slots, 0);

    if (start > endPosition || start < startPosition) {
      element.setSelectionRange(endPosition, endPosition);
    }
  };

  const register = (registerParams?: UseMaskRegisterParams) => ({
    ref: (node: HTMLInputElement | null | undefined) => {
      inputRef.current = node ?? null;

      if (!node || node.value) {
        return;
      }

      const { showMask, slots, slot } = getResolvedOptions(optionsRef.current, '');

      if (!shouldShowMask(showMask, false, '')) {
        return;
      }

      const displayValue = buildDisplayValue('', slots, slot, true);

      node.value = displayValue;
      displayValueRef.current = displayValue;
      updateRefs({ displayValue });
    },
    onChange: ((event) => {
      const element = event.currentTarget;
      const { slots, transform } = getResolvedOptions(optionsRef.current, rawValueRef.current);
      const previousValue = displayValueRef.current;
      const currentValue = element.value;

      let sharedPrefixLength = 0;
      const maxPrefix = Math.min(previousValue.length, currentValue.length);
      while (
        sharedPrefixLength < maxPrefix &&
        previousValue[sharedPrefixLength] === currentValue[sharedPrefixLength]
      ) {
        sharedPrefixLength++;
      }

      let sharedSuffixLength = 0;
      const maxSuffix = Math.min(
        previousValue.length - sharedPrefixLength,
        currentValue.length - sharedPrefixLength
      );
      while (
        sharedSuffixLength < maxSuffix &&
        previousValue[previousValue.length - 1 - sharedSuffixLength] ===
          currentValue[currentValue.length - 1 - sharedSuffixLength]
      ) {
        sharedSuffixLength++;
      }

      const insertedText = currentValue.slice(
        sharedPrefixLength,
        currentValue.length - sharedSuffixLength
      );
      const removedEnd = previousValue.length - sharedSuffixLength;
      const beforeRawValue = extractRaw(
        previousValue.slice(0, sharedPrefixLength),
        slots.slice(0, sharedPrefixLength)
      );
      const afterRawValue = extractRaw(previousValue.slice(removedEnd), slots.slice(removedEnd));
      const reformattedValue = applyMaskToRaw(
        beforeRawValue + insertedText + afterRawValue,
        slots,
        transform
      );
      const maskedPrefix = applyMaskToRaw(beforeRawValue + insertedText, slots, transform);

      if (reformattedValue !== previousValue) {
        pushUndoState();
      }

      updateValue(reformattedValue, maskedPrefix.length);
      registerParams?.onChange?.(event);
    }) as ChangeEventHandler<HTMLInputElement>,
    onFocus: ((event) => {
      const input = event.currentTarget;
      isFocusedRef.current = true;

      const { slots, showMask, slot } = getResolvedOptions(optionsRef.current, rawValueRef.current);
      const processedValue = processedRef.current;
      const displayValue = buildDisplayValue(
        processedValue,
        slots,
        slot,
        shouldShowMask(showMask, true, processedValue)
      );

      input.value = displayValue;
      displayValueRef.current = displayValue;
      updateRefs({ displayValue });

      requestAnimationFrame(() => {
        if (input === document.activeElement) {
          clampCursorToProcessed(input);
        }
      });
      registerParams?.onFocus?.(event);
    }) as FocusEventHandler<HTMLInputElement>,
    onBlur: ((event) => {
      const input = event.currentTarget;
      isFocusedRef.current = false;

      const { slots, showMask, slot, transform } = getResolvedOptions(
        optionsRef.current,
        rawValueRef.current
      );
      const expectedFocusValue = buildDisplayValue(processedRef.current, slots, slot, true);
      const processedValue =
        input.value === expectedFocusValue
          ? processedRef.current
          : processInput(input.value, slots, transform);
      const complete = checkComplete(processedValue, slots);

      if (optionsRef.current.autoClear && !complete && processedValue.length > 0) {
        let nextDisplayValue = '';

        processedRef.current = '';
        displayValueRef.current = '';
        rawValueRef.current = '';
        updateRefs({
          displayValue: '',
          filled: false,
          maskedValue: '',
          rawValue: ''
        });
        wasCompleteRef.current = false;

        if (shouldShowMask(showMask, false, '')) {
          nextDisplayValue = buildDisplayValue('', slots, slot, true);

          displayValueRef.current = nextDisplayValue;
          updateRefs({ displayValue: nextDisplayValue });
        }

        input.value = nextDisplayValue;
        optionsRef.current.onChangeRaw?.('', nextDisplayValue);
        registerParams?.onBlur?.(event);
        return;
      }

      if (!complete) {
        const showSlots = shouldShowMask(showMask, false, processedValue);

        if (extractRaw(processedValue, slots).length === 0 && !showSlots) {
          input.value = '';
          processedRef.current = '';
          displayValueRef.current = '';
          rawValueRef.current = '';
          updateRefs({
            displayValue: '',
            filled: false,
            maskedValue: '',
            rawValue: ''
          });
          wasCompleteRef.current = false;
          optionsRef.current.onChangeRaw?.('', '');

          registerParams?.onBlur?.(event);
          return;
        }

        const displayValue = buildDisplayValue(processedValue, slots, slot, showSlots);

        input.value = displayValue;
        displayValueRef.current = displayValue;
        processedRef.current = processedValue;
        rawValueRef.current = extractRaw(processedValue, slots);
        updateRefs({
          displayValue,
          filled: false,
          maskedValue: applyMaskToRaw(rawValueRef.current, slots, transform),
          rawValue: rawValueRef.current
        });
      }

      registerParams?.onBlur?.(event);
    }) as FocusEventHandler<HTMLInputElement>,
    onMouseDown: ((event) => {
      const input = event.currentTarget;

      requestAnimationFrame(() => {
        if (input !== document.activeElement) {
          return;
        }

        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        if (start !== end) {
          return;
        }

        const { slots } = getResolvedOptions(optionsRef.current, rawValueRef.current);
        const processedValue = processedRef.current;
        const endPosition =
          processedValue.length > 0
            ? findNextEditablePosition(processedValue.length, slots)
            : findNextTokenIndex(slots, 0);

        if (start > endPosition) {
          input.setSelectionRange(endPosition, endPosition);
        }
      });
      registerParams?.onMouseDown?.(event);
    }) as MouseEventHandler<HTMLInputElement>,
    onMouseUp: ((event) => {
      const input = event.currentTarget;

      if (input === document.activeElement) {
        clampCursorToProcessed(input);
      }

      registerParams?.onMouseUp?.(event);
    }) as MouseEventHandler<HTMLInputElement>,
    onKeyDown: ((event) => {
      const input = event.currentTarget;
      const { slots, transform } = getResolvedOptions(optionsRef.current, rawValueRef.current);
      const processedValue = processedRef.current;
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      const modifier = event.metaKey || (event.ctrlKey && !event.altKey);
      const key = event.key.toLowerCase();

      if (modifier && key === 'z' && !event.shiftKey) {
        event.preventDefault();

        const previousState = undoStackRef.current.pop();
        if (!previousState) {
          registerParams?.onKeyDown?.(event);
          return;
        }

        redoStackRef.current.push({
          rawValue: rawValueRef.current,
          selectionStart: input.selectionStart ?? 0
        });
        applyHistoryState(previousState);
        registerParams?.onKeyDown?.(event);
        return;
      }

      if (modifier && ((key === 'z' && event.shiftKey) || (key === 'y' && !event.shiftKey))) {
        event.preventDefault();

        const nextState = redoStackRef.current.pop();
        if (!nextState) {
          registerParams?.onKeyDown?.(event);
          return;
        }

        undoStackRef.current.push({
          rawValue: rawValueRef.current,
          selectionStart: input.selectionStart ?? 0
        });
        applyHistoryState(nextState);
        registerParams?.onKeyDown?.(event);
        return;
      }

      if (event.key === 'Backspace') {
        event.preventDefault();
        const edit = deleteBackward(processedValue, slots, start, end, modifier, transform);

        if (edit) {
          pushUndoState();
          updateValue(edit.value, edit.cursor);
        }

        registerParams?.onKeyDown?.(event);
        return;
      }

      if (event.key === 'Delete') {
        event.preventDefault();
        const edit = deleteForward(processedValue, slots, start, end, transform);

        if (edit) {
          pushUndoState();
          updateValue(edit.value, edit.cursor);
        }

        registerParams?.onKeyDown?.(event);
        return;
      }

      if (event.key === 'ArrowRight' && !event.shiftKey) {
        const nextPosition = findNextEditablePosition(start + 1, slots);

        if (nextPosition !== start + 1) {
          event.preventDefault();
          input.setSelectionRange(nextPosition, nextPosition);
        }

        registerParams?.onKeyDown?.(event);
        return;
      }

      if (event.key === 'ArrowLeft' && !event.shiftKey) {
        if (start > 0) {
          const previousToken = findPrevTokenIndex(slots, start - 1);

          if (previousToken >= 0 && previousToken !== start - 1) {
            event.preventDefault();
            input.setSelectionRange(previousToken + 1, previousToken + 1);
          }
        }

        registerParams?.onKeyDown?.(event);
        return;
      }

      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        const edit = insertChar(processedValue, slots, start, end, event.key, transform);

        if (edit) {
          pushUndoState();
          updateValue(edit.value, edit.cursor);
        }
      }

      registerParams?.onKeyDown?.(event);
    }) as KeyboardEventHandler<HTMLInputElement>,
    onPaste: ((event) => {
      const input = event.currentTarget;
      event.preventDefault();

      const pastedText = event.clipboardData?.getData('text') ?? '';
      const { slots, transform } = getResolvedOptions(optionsRef.current, rawValueRef.current);
      const processedValue = processedRef.current;
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      const edit = pasteText(processedValue, slots, start, end, pastedText, transform);

      pushUndoState();
      updateValue(edit.value);

      if (input === document.activeElement) {
        input.setSelectionRange(edit.cursor, edit.cursor);
      }

      registerParams?.onPaste?.(event);
    }) as ClipboardEventHandler<HTMLInputElement>
  });

  const reset = () => {
    const input = inputRef.current;
    const hookOptions = optionsRef.current;

    processedRef.current = '';
    displayValueRef.current = '';
    rawValueRef.current = '';
    undoStackRef.current = [];
    redoStackRef.current = [];
    updateRefs({
      displayValue: '',
      filled: false,
      maskedValue: '',
      rawValue: ''
    });
    wasCompleteRef.current = false;
    let nextDisplayValue = '';

    if (input) {
      const { showMask, slots, slot } = getResolvedOptions(hookOptions, '');

      if (shouldShowMask(showMask, false, '')) {
        nextDisplayValue = buildDisplayValue('', slots, slot, true);

        displayValueRef.current = nextDisplayValue;
        updateRefs({ displayValue: nextDisplayValue });
      }

      input.value = nextDisplayValue;
    }

    hookOptions.onChangeRaw?.('', nextDisplayValue);
  };

  const watch = () => {
    watchingRef.current = true;
    return valueRef.current;
  };

  return {
    register,
    displayValue: valueRef.current.displayValue,
    value: valueRef.current.value,
    maskedValue: valueRef.current.maskedValue,
    rawValue: valueRef.current.rawValue,
    filled: valueRef.current.filled,
    set,
    reset,
    watch
  };
};
