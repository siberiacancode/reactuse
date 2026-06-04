import { useRef, useState } from 'react';
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
  let slot = options.slot === undefined ? '_' : options.slot;
  const overrides = options.modify?.(rawValue);
  if (overrides) {
    if (overrides.mask !== undefined) {
      mask = overrides.mask;
    }
    if (overrides.tokens !== undefined) {
      Object.assign(tokens, overrides.tokens);
    }
    if (overrides.slot !== undefined) {
      slot = overrides.slot;
    }
    if (overrides.showMask !== undefined) {
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
const findNextEditablePosition = (from, slots, value) => {
  let position = from;
  while (
    position < slots.length &&
    position < value.length &&
    slots[position] &&
    slots[position].type === 'literal'
  ) {
    position++;
  }
  return position;
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
 * @param {UseMaskOptions} options The hook options
 * @returns {UseMaskReturn} An object with the masked input state
 *
 * @example
 * const phoneMask = useMask({ mask: '+7 (999) 999-99-99' });
 * <input {...phoneMask.register()} />
 */
export const useMask = (options) => {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const inputRef = useRef(null);
  const [maskedValue, setMaskedValue] = useState('');
  const [rawValue, setRawValue] = useState('');
  const processedRef = useRef('');
  const displayValueRef = useRef('');
  const rawValueRef = useRef('');
  const wasCompleteRef = useRef(false);
  const isFocusedRef = useRef(false);
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
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
    const maskedState = hookOptions.beforeMaskedStateChange
      ? hookOptions.beforeMaskedStateChange({
          previousState,
          currentState,
          nextState
        })
      : nextState;
    const displayValue = maskedState.value;
    const finalProcessedValue = processInput(
      displayValue,
      resolvedOptions.slots,
      resolvedOptions.transform
    );
    const finalRawValue = extractRaw(finalProcessedValue, resolvedOptions.slots);
    processedRef.current = finalProcessedValue;
    displayValueRef.current = displayValue;
    rawValueRef.current = finalRawValue;
    setMaskedValue(displayValue);
    setRawValue(finalRawValue);
    if (inputRef.current) {
      inputRef.current.value = displayValue;
      if (maskedState.selection && document.activeElement === inputRef.current) {
        inputRef.current.setSelectionRange(maskedState.selection.start, maskedState.selection.end);
      }
    }
    hookOptions.onChangeRaw?.(finalRawValue, displayValue);
    const complete = checkComplete(finalProcessedValue, resolvedOptions.slots);
    if (complete && !wasCompleteRef.current) {
      hookOptions.onComplete?.(displayValue, finalRawValue);
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
  const set = (value) => {
    const { slots, transform } = getResolvedOptions(optionsRef.current, value);
    const nextMaskedValue = applyMaskToRaw(value, slots, transform);
    updateValue(nextMaskedValue);
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
        ? findNextEditablePosition(processedValue.length, slots, processedValue)
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
      const { showMask, slots, slot } = getResolvedOptions(optionsRef.current, '');
      if (!shouldShowMask(showMask, false, '')) {
        return;
      }
      const displayValue = buildDisplayValue('', slots, slot, true);
      node.value = displayValue;
      displayValueRef.current = displayValue;
      setMaskedValue(displayValue);
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
      setMaskedValue(displayValue);
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
        input.value = '';
        processedRef.current = '';
        displayValueRef.current = '';
        rawValueRef.current = '';
        setMaskedValue('');
        setRawValue('');
        wasCompleteRef.current = false;
        optionsRef.current.onChangeRaw?.('', '');
        if (shouldShowMask(showMask, false, '')) {
          const emptyDisplayValue = buildDisplayValue('', slots, slot, true);
          input.value = emptyDisplayValue;
          displayValueRef.current = emptyDisplayValue;
          setMaskedValue(emptyDisplayValue);
        }
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
          setMaskedValue('');
          setRawValue('');
          wasCompleteRef.current = false;
          optionsRef.current.onChangeRaw?.('', '');
          registerParams?.onBlur?.(event);
          return;
        }
        const displayValue = buildDisplayValue(processedValue, slots, slot, showSlots);
        input.value = displayValue;
        displayValueRef.current = displayValue;
        setMaskedValue(displayValue);
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
            ? findNextEditablePosition(processedValue.length, slots, processedValue)
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
        if (event.metaKey || (event.ctrlKey && !event.altKey)) {
          const clampedStart = Math.min(start, processedValue.length);
          const afterRawValue = extractRaw(
            processedValue.slice(clampedStart),
            slots.slice(clampedStart)
          );
          const nextMaskedValue = applyMaskToRaw(afterRawValue, slots, transform);
          pushUndoState();
          updateValue(nextMaskedValue, 0);
          registerParams?.onKeyDown?.(event);
          return;
        }
        if (start !== end) {
          const clampedEnd = Math.min(end, processedValue.length);
          const beforeValue = processedValue.slice(0, start);
          const afterRawValue = extractRaw(
            processedValue.slice(clampedEnd),
            slots.slice(clampedEnd)
          );
          const nextMaskedValue = applyMaskToRaw(
            extractRaw(beforeValue, slots) + afterRawValue,
            slots,
            transform
          );
          pushUndoState();
          updateValue(nextMaskedValue, start);
          registerParams?.onKeyDown?.(event);
          return;
        }
        if (start === 0) {
          registerParams?.onKeyDown?.(event);
          return;
        }
        let deletePosition = start - 1;
        while (deletePosition >= 0 && slots[deletePosition]?.type === 'literal') {
          deletePosition--;
        }
        if (deletePosition < 0) {
          registerParams?.onKeyDown?.(event);
          return;
        }
        const beforeRawValue = extractRaw(
          processedValue.slice(0, deletePosition),
          slots.slice(0, deletePosition)
        );
        const afterRawValue = extractRaw(
          processedValue.slice(deletePosition + 1),
          slots.slice(deletePosition + 1)
        );
        const nextMaskedValue = applyMaskToRaw(beforeRawValue + afterRawValue, slots, transform);
        pushUndoState();
        updateValue(nextMaskedValue, deletePosition);
        registerParams?.onKeyDown?.(event);
        return;
      }
      if (event.key === 'Delete') {
        event.preventDefault();
        if (start !== end) {
          const clampedEnd = Math.min(end, processedValue.length);
          const beforeValue = processedValue.slice(0, start);
          const afterRawValue = extractRaw(
            processedValue.slice(clampedEnd),
            slots.slice(clampedEnd)
          );
          const nextMaskedValue = applyMaskToRaw(
            extractRaw(beforeValue, slots) + afterRawValue,
            slots,
            transform
          );
          pushUndoState();
          updateValue(nextMaskedValue, start);
          registerParams?.onKeyDown?.(event);
          return;
        }
        let deletePosition = start;
        while (deletePosition < slots.length && slots[deletePosition]?.type === 'literal') {
          deletePosition++;
        }
        if (deletePosition >= processedValue.length) {
          registerParams?.onKeyDown?.(event);
          return;
        }
        const beforeRawValue = extractRaw(processedValue.slice(0, start), slots.slice(0, start));
        const afterRawValue = extractRaw(
          processedValue.slice(deletePosition + 1),
          slots.slice(deletePosition + 1)
        );
        const nextMaskedValue = applyMaskToRaw(beforeRawValue + afterRawValue, slots, transform);
        pushUndoState();
        updateValue(nextMaskedValue, start);
        registerParams?.onKeyDown?.(event);
        return;
      }
      if (event.key === 'ArrowRight' && !event.shiftKey) {
        const nextPosition = findNextEditablePosition(start + 1, slots, input.value);
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
        let insertPosition = Math.min(start, processedValue.length);
        while (insertPosition < slots.length && slots[insertPosition]?.type === 'literal') {
          insertPosition++;
        }
        if (insertPosition >= slots.length) {
          registerParams?.onKeyDown?.(event);
          return;
        }
        const slot = slots[insertPosition];
        if (slot.type !== 'token') {
          registerParams?.onKeyDown?.(event);
          return;
        }
        const char = normalizeChar(event.key, transform);
        if (!testPattern(slot.pattern, char)) {
          registerParams?.onKeyDown?.(event);
          return;
        }
        const beforeRawValue = extractRaw(
          processedValue.slice(0, insertPosition),
          slots.slice(0, insertPosition)
        );
        const afterRawValue =
          start < end
            ? extractRaw(
                processedValue.slice(Math.min(end, processedValue.length)),
                slots.slice(Math.min(end, processedValue.length))
              )
            : extractRaw(processedValue.slice(insertPosition), slots.slice(insertPosition));
        const nextMaskedValue = applyMaskToRaw(
          beforeRawValue + char + afterRawValue,
          slots,
          transform
        );
        const nextCursorPosition = findNextEditablePosition(
          insertPosition + 1,
          slots,
          nextMaskedValue
        );
        pushUndoState();
        updateValue(nextMaskedValue, nextCursorPosition);
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
      const clampedStart = Math.min(start, processedValue.length);
      const clampedEnd = Math.min(end, processedValue.length);
      const beforeRawValue = extractRaw(
        processedValue.slice(0, clampedStart),
        slots.slice(0, clampedStart)
      );
      const afterRawValue = extractRaw(processedValue.slice(clampedEnd), slots.slice(clampedEnd));
      const nextMaskedValue = applyMaskToRaw(
        beforeRawValue + pastedText + afterRawValue,
        slots,
        transform
      );
      pushUndoState();
      updateValue(nextMaskedValue);
      const maskedPrefix = applyMaskToRaw(beforeRawValue + pastedText, slots, transform);
      const pasteEndPosition = Math.min(maskedPrefix.length, slots.length);
      if (input === document.activeElement) {
        input.setSelectionRange(pasteEndPosition, pasteEndPosition);
      }
      registerParams?.onPaste?.(event);
    }
  });
  const reset = () => {
    const input = inputRef.current;
    const hookOptions = optionsRef.current;
    processedRef.current = '';
    displayValueRef.current = '';
    rawValueRef.current = '';
    undoStackRef.current = [];
    redoStackRef.current = [];
    setMaskedValue('');
    setRawValue('');
    wasCompleteRef.current = false;
    if (input) {
      const { showMask, slots, slot } = getResolvedOptions(hookOptions, '');
      if (shouldShowMask(showMask, false, '')) {
        const displayValue = buildDisplayValue('', slots, slot, true);
        input.value = displayValue;
        displayValueRef.current = displayValue;
        setMaskedValue(displayValue);
      } else {
        input.value = '';
      }
    }
    hookOptions.onChangeRaw?.('', '');
  };
  const filled = checkComplete(
    processedRef.current,
    getResolvedOptions(optionsRef.current, rawValueRef.current).slots
  );
  return {
    register,
    displayValue: maskedValue,
    value: maskedValue,
    rawValue,
    filled,
    set,
    reset
  };
};
