import { useRef } from 'react';
import { useRerender } from '../useRerender/useRerender';
const DEFAULT_TOKENS = {
  9: /\d/,
  a: /[A-Z]/i,
  A: /[A-Z]/,
  '*': /[A-Z0-9]/i,
  '#': /[-+0-9]/
};
const MAX_UNDO_HISTORY = 100;
const shouldShowMask = (showMask, focused, processedValue) => {
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
export const normalizeChar = (char, transform) => {
  const transformed = transform ? transform(char) : char;
  return transformed[0] ?? '';
};
export const testPattern = (pattern, char) => {
  pattern.lastIndex = 0;
  return pattern.test(char);
};
export const parseMask = (mask, tokens) => {
  if (Array.isArray(mask)) {
    return mask.map((item) => {
      if (item instanceof RegExp) {
        return { type: 'token', char: '_', pattern: item };
      }
      return { type: 'literal', char: item };
    });
  }
  const slots = [];
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
export const getSlot = (slot, index) => {
  if (!slot) {
    return '';
  }
  if (slot.length === 1) {
    return slot;
  }
  return slot[index] ?? '';
};
export const consumeToMask = (inputValue, slots, options) => {
  let result = '';
  let inputIndex = 0;
  let pendingLiterals = '';
  for (const slot of slots) {
    if (slot.type === 'literal') {
      pendingLiterals += slot.char;
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
        result += pendingLiterals + char;
        pendingLiterals = '';
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
export const applyMaskToRaw = (rawValue, slots, transform) =>
  consumeToMask(rawValue, slots, {
    transform,
    consumeMatchingLiterals: false
  });
export const processInput = (inputValue, slots, transform) =>
  consumeToMask(inputValue, slots, {
    transform,
    consumeMatchingLiterals: true
  });
export const buildDisplayValue = (processedValue, slots, slotValue, showSlots) => {
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
export const extractRaw = (maskedValue, slots) => {
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
export const checkComplete = (maskedValue, slots) => {
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
export const findNextTokenIndex = (slots, from) => {
  for (let index = from; index < slots.length; index++) {
    if (slots[index].type === 'token') {
      return index;
    }
  }
  return slots.length;
};
export const findPrevTokenIndex = (slots, from) => {
  for (let index = from; index >= 0; index--) {
    if (slots[index].type === 'token') {
      return index;
    }
  }
  return -1;
};
const getResolvedOptions = (options, rawValue) => {
  const tokens = { ...DEFAULT_TOKENS, ...options.tokens };
  let mask = options.mask;
  let showMask = options.showMask ?? 'focus';
  let slot = options.slot === undefined ? ' ' : options.slot;
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
const getInputSelection = (input) => {
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
const findNextEditablePosition = (from, slots) => {
  let position = from;
  while (position < slots.length && slots[position]?.type === 'literal') {
    position++;
  }
  return position;
};
export const replaceRangeWithText = (processedValue, slots, start, end, text, transform) => {
  const beforeRawValue = extractRaw(processedValue.slice(0, start), slots.slice(0, start));
  const afterRawValue = extractRaw(processedValue.slice(end), slots.slice(end));
  return applyMaskToRaw(beforeRawValue + text + afterRawValue, slots, transform);
};
export const deleteBackward = (processedValue, slots, start, end, modifier, transform) => {
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
export const deleteForward = (processedValue, slots, start, end, transform) => {
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
export const insertChar = (processedValue, slots, start, end, char, transform) => {
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
export const pasteText = (processedValue, slots, start, end, text, transform) => {
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
export const formatMask = (rawValue, options) => {
  const { slots, transform } = getResolvedOptions(options, rawValue);
  return applyMaskToRaw(rawValue, slots, transform);
};
export const unformatMask = (maskedValue, options) => {
  const { slots } = getResolvedOptions(options, '');
  return extractRaw(maskedValue, slots);
};
export const isMaskComplete = (maskedValue, options) => {
  const { slots } = getResolvedOptions(options, '');
  return checkComplete(maskedValue, slots);
};
export const generatePattern = (mode, options) => {
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
 * @param {UseMaskPattern} mask Mask pattern string or array of literals and RegExp tokens
 * @param {Omit<UseMaskOptions, 'mask'>} [options] The hook options when mask is passed as the first argument
 * @param {boolean} [options.autoClear=false] Clear value on blur when mask is incomplete
 * @param {string} [options.initialValue=""] Initial raw value
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
 * const phoneMask = useMask('+7 (999) 999-99-99');
 */
export const useMask = (mask, options) => {
  const hookOptions = { ...options, mask };
  const optionsRef = useRef(hookOptions);
  optionsRef.current = hookOptions;
  const initialRawValue = hookOptions.initialValue ?? '';
  const initialResolvedOptions = getResolvedOptions(hookOptions, initialRawValue);
  const initialMaskedValue = applyMaskToRaw(
    initialRawValue,
    initialResolvedOptions.slots,
    initialResolvedOptions.transform
  );
  const initialDisplayValue = buildDisplayValue(
    initialMaskedValue,
    initialResolvedOptions.slots,
    initialResolvedOptions.slot,
    shouldShowMask(initialResolvedOptions.showMask, false, initialMaskedValue)
  );
  const initialFilled = checkComplete(initialMaskedValue, initialResolvedOptions.slots);
  const inputRef = useRef(null);
  const valueRef = useRef({
    displayValue: initialDisplayValue,
    filled: initialFilled,
    maskedValue: initialMaskedValue,
    rawValue: initialRawValue,
    value: initialDisplayValue
  });
  const processedRef = useRef(initialMaskedValue);
  const displayValueRef = useRef(initialDisplayValue);
  const rawValueRef = useRef(initialRawValue);
  const wasCompleteRef = useRef(initialFilled);
  const isFocusedRef = useRef(false);
  const watchingRef = useRef(false);
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  const rerender = useRerender();
  const updateRefs = (value) => {
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
  const updateValue = (nextMaskedValue, cursorPosition) => {
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
    const state = {
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
  const applyHistoryState = (state) => {
    const { slots, transform } = getResolvedOptions(optionsRef.current, state.rawValue);
    const nextMaskedValue = applyMaskToRaw(state.rawValue, slots, transform);
    updateValue(nextMaskedValue, state.selectionStart);
  };
  const setValue = (value) => {
    const { slots, transform } = getResolvedOptions(optionsRef.current, value);
    const nextMaskedValue = applyMaskToRaw(value, slots, transform);
    updateValue(nextMaskedValue);
  };
  const getValue = (type = 'raw') => {
    if (type === 'display') {
      return valueRef.current.displayValue;
    }
    if (type === 'masked') {
      return valueRef.current.maskedValue;
    }
    return valueRef.current.rawValue;
  };
  const clampCursorToProcessed = (element) => {
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
  const register = (registerParams) => ({
    ref: (node) => {
      inputRef.current = node ?? null;
      if (!node || node.value) {
        return;
      }
      node.value = displayValueRef.current;
    },
    onChange: (event) => {
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
    },
    onFocus: (event) => {
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
    },
    onBlur: (event) => {
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
    },
    onMouseDown: (event) => {
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
    },
    onMouseUp: (event) => {
      const input = event.currentTarget;
      if (input === document.activeElement) {
        clampCursorToProcessed(input);
      }
      registerParams?.onMouseUp?.(event);
    },
    onKeyDown: (event) => {
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
    },
    onPaste: (event) => {
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
    }
  });
  const reset = () => {
    const input = inputRef.current;
    const hookOptions = optionsRef.current;
    const nextRawValue = hookOptions.initialValue ?? '';
    const { showMask, slots, slot, transform } = getResolvedOptions(hookOptions, nextRawValue);
    const nextMaskedValue = applyMaskToRaw(nextRawValue, slots, transform);
    const nextDisplayValue = buildDisplayValue(
      nextMaskedValue,
      slots,
      slot,
      shouldShowMask(showMask, false, nextMaskedValue)
    );
    const complete = checkComplete(nextMaskedValue, slots);
    processedRef.current = nextMaskedValue;
    displayValueRef.current = nextDisplayValue;
    rawValueRef.current = nextRawValue;
    undoStackRef.current = [];
    redoStackRef.current = [];
    updateRefs({
      displayValue: nextDisplayValue,
      filled: complete,
      maskedValue: nextMaskedValue,
      rawValue: nextRawValue
    });
    wasCompleteRef.current = complete;
    if (input) {
      input.value = nextDisplayValue;
    }
    hookOptions.onChangeRaw?.(nextRawValue, nextDisplayValue);
  };
  const watch = () => {
    watchingRef.current = true;
    return valueRef.current;
  };
  return {
    getValue,
    ref: inputRef,
    register,
    setValue,
    reset,
    watch
  };
};
