import { useEffect, useRef, useState } from 'react';
import { useRefState } from '../useRefState/useRefState';
const DEFAULT_TOKENS = {
  9: /\d/,
  a: /[A-Z]/i,
  A: /[A-Z]/,
  '*': /[A-Z0-9]/i,
  '#': /[-+0-9]/
};
const MAX_UNDO_HISTORY = 100;
const parseMask = (mask, tokens) => {
  if (Array.isArray(mask)) {
    return mask.map((item) => {
      if (item instanceof RegExp) {
        return { type: 'token', char: '_', pattern: item };
      }
      return { type: 'literal', char: item };
    });
  }
  const slots = [];
  let optional = false;
  for (let index = 0; index < mask.length; index++) {
    const char = mask[index];
    if (char === '\\' && index + 1 < mask.length) {
      index++;
      slots.push({ type: 'literal', char: mask[index] });
      continue;
    }
    if (char === '?') {
      optional = true;
      continue;
    }
    if (tokens[char]) {
      slots.push({ type: 'token', char, pattern: tokens[char], optional });
      continue;
    }
    slots.push({ type: 'literal', char, optional });
  }
  return slots;
};
const getSlotChar = (slotChar, index) => {
  if (slotChar === null || slotChar === '' || slotChar === undefined) {
    return '';
  }
  if (slotChar.length > 1) {
    return slotChar[index] || '_';
  }
  return slotChar;
};
const applyMaskToRaw = (rawValue, slots, _slotChar, transform) => {
  let result = '';
  let rawIndex = 0;
  for (let slotIndex = 0; slotIndex < slots.length; slotIndex++) {
    const slot = slots[slotIndex];
    if (slot.type === 'literal') {
      result += slot.char;
      continue;
    }
    if (rawIndex >= rawValue.length) {
      break;
    }
    const char = transform ? transform(rawValue[rawIndex]) : rawValue[rawIndex];
    if (slot.pattern.test(char)) {
      result += char;
      rawIndex++;
      continue;
    }
    rawIndex++;
    slotIndex--;
  }
  return result;
};
const buildDisplayValue = (processedValue, slots, slotChar, showSlots) => {
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
    const char = getSlotChar(slotChar, index);
    if (!char) {
      break;
    }
    displayValue += char;
  }
  return displayValue;
};
const extractRaw = (maskedValue, slots) => {
  let rawValue = '';
  for (let index = 0; index < maskedValue.length && index < slots.length; index++) {
    if (slots[index].type === 'token') {
      rawValue += maskedValue[index];
    }
  }
  return rawValue;
};
const checkComplete = (maskedValue, slots) => {
  for (let index = 0; index < slots.length; index++) {
    const slot = slots[index];
    if (slot.type !== 'token' || slot.optional) {
      continue;
    }
    if (index >= maskedValue.length) {
      return false;
    }
    if (!slot.pattern.test(maskedValue[index])) {
      return false;
    }
  }
  return true;
};
const findNextTokenIndex = (slots, from) => {
  for (let index = from; index < slots.length; index++) {
    if (slots[index].type === 'token') {
      return index;
    }
  }
  return slots.length;
};
const findPrevTokenIndex = (slots, from) => {
  for (let index = from; index >= 0; index--) {
    if (slots[index].type === 'token') {
      return index;
    }
  }
  return -1;
};
const processInput = (inputValue, slots, _slotChar, transform) => {
  let result = '';
  let inputIndex = 0;
  for (
    let slotIndex = 0;
    slotIndex < slots.length && inputIndex <= inputValue.length;
    slotIndex++
  ) {
    const slot = slots[slotIndex];
    if (slot.type === 'literal') {
      result += slot.char;
      if (inputIndex < inputValue.length && inputValue[inputIndex] === slot.char) {
        inputIndex++;
      }
      continue;
    }
    if (inputIndex >= inputValue.length) {
      break;
    }
    while (inputIndex < inputValue.length) {
      const char = transform ? transform(inputValue[inputIndex]) : inputValue[inputIndex];
      inputIndex++;
      if (slot.pattern.test(char)) {
        result += char;
        break;
      }
    }
    if (result.length <= slotIndex) {
      break;
    }
  }
  return result;
};
const getResolvedOptions = (options, rawValue) => {
  const tokens = { ...DEFAULT_TOKENS, ...options.tokens };
  let mask = options.mask;
  let slotChar = options.slotChar === undefined ? '_' : options.slotChar;
  const overrides = options.modify?.(rawValue);
  if (overrides) {
    if (overrides.mask !== undefined) {
      mask = overrides.mask;
    }
    if (overrides.tokens !== undefined) {
      Object.assign(tokens, overrides.tokens);
    }
    if (overrides.slotChar !== undefined) {
      slotChar = overrides.slotChar;
    }
  }
  return {
    slots: parseMask(mask, tokens),
    slotChar,
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
  const { slots, slotChar, transform } = getResolvedOptions(options, rawValue);
  return applyMaskToRaw(rawValue, slots, slotChar, transform);
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
 */
export const useMask = (options) => {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const inputRef = useRefState(null);
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
    // Re-resolve the mask from the normalized raw value so dynamic masks stay in sync.
    const initialProcessedValue = processInput(
      nextMaskedValue,
      initialOptions.slots,
      initialOptions.slotChar,
      initialOptions.transform
    );
    const nextRawValue = extractRaw(initialProcessedValue, initialOptions.slots);
    const resolvedOptions = getResolvedOptions(hookOptions, nextRawValue);
    const processedValue = processInput(
      nextMaskedValue,
      resolvedOptions.slots,
      resolvedOptions.slotChar,
      resolvedOptions.transform
    );
    const showSlots = hookOptions.alwaysShowMask || isFocusedRef.current;
    const showMaskOnFocus = hookOptions.showMaskOnFocus !== false;
    const nextDisplayValue = buildDisplayValue(
      processedValue,
      resolvedOptions.slots,
      resolvedOptions.slotChar,
      showSlots && (showMaskOnFocus || processedValue.length > 0)
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
    // Let consumers adjust the computed state before it is committed.
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
      resolvedOptions.slotChar,
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
    const { slots, slotChar, transform } = getResolvedOptions(optionsRef.current, state.rawValue);
    const nextMaskedValue = applyMaskToRaw(state.rawValue, slots, slotChar, transform);
    updateValue(nextMaskedValue, state.selectionStart);
  };
  const set = (value) => {
    const { slots, slotChar, transform } = getResolvedOptions(optionsRef.current, value);
    const nextMaskedValue = applyMaskToRaw(value, slots, slotChar, transform);
    updateValue(nextMaskedValue);
  };
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
      if (hookOptions.alwaysShowMask) {
        const { slots, slotChar } = getResolvedOptions(hookOptions, '');
        const displayValue = buildDisplayValue('', slots, slotChar, true);
        input.value = displayValue;
        displayValueRef.current = displayValue;
        setMaskedValue(displayValue);
      } else {
        input.value = '';
      }
    }
    hookOptions.onChangeRaw?.('', '');
  };
  useEffect(() => {
    const input = inputRef.state;
    if (!input) return;
    const onInput = (event) => {
      const element = event.currentTarget;
      const { slots, slotChar, transform } = getResolvedOptions(
        optionsRef.current,
        rawValueRef.current
      );
      const previousValue = displayValueRef.current;
      const currentValue = element.value;
      // Diff the previous and next values so we only reinsert the user-edited segment.
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
        slotChar,
        transform
      );
      const maskedPrefix = applyMaskToRaw(
        beforeRawValue + insertedText,
        slots,
        slotChar,
        transform
      );
      if (reformattedValue !== previousValue) {
        pushUndoState();
      }
      updateValue(reformattedValue, maskedPrefix.length);
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
      // Keep the caret inside editable token positions.
      if (start > endPosition || start < startPosition) {
        element.setSelectionRange(endPosition, endPosition);
      }
    };
    const onFocus = () => {
      isFocusedRef.current = true;
      const { slots, slotChar } = getResolvedOptions(optionsRef.current, rawValueRef.current);
      const showMaskOnFocus = optionsRef.current.showMaskOnFocus !== false;
      const processedValue = processedRef.current;
      if (showMaskOnFocus || optionsRef.current.alwaysShowMask) {
        const displayValue = buildDisplayValue(processedValue, slots, slotChar, true);
        input.value = displayValue;
        displayValueRef.current = displayValue;
        setMaskedValue(displayValue);
      }
      requestAnimationFrame(() => {
        if (input === document.activeElement) {
          clampCursorToProcessed(input);
        }
      });
    };
    const onMouseUp = () => {
      if (input !== document.activeElement) {
        return;
      }
      clampCursorToProcessed(input);
    };
    const onMouseDown = () => {
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
    };
    const onBlur = () => {
      isFocusedRef.current = false;
      const { slots, slotChar, transform } = getResolvedOptions(
        optionsRef.current,
        rawValueRef.current
      );
      const expectedFocusValue = buildDisplayValue(processedRef.current, slots, slotChar, true);
      const processedValue =
        input.value === expectedFocusValue
          ? processedRef.current
          : processInput(input.value, slots, slotChar, transform);
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
        if (optionsRef.current.alwaysShowMask) {
          const emptyDisplayValue = buildDisplayValue('', slots, slotChar, true);
          input.value = emptyDisplayValue;
          displayValueRef.current = emptyDisplayValue;
          setMaskedValue(emptyDisplayValue);
        }
        return;
      }
      if (!optionsRef.current.alwaysShowMask && !complete) {
        if (extractRaw(processedValue, slots).length === 0) {
          input.value = '';
          processedRef.current = '';
          displayValueRef.current = '';
          rawValueRef.current = '';
          setMaskedValue('');
          setRawValue('');
          wasCompleteRef.current = false;
          optionsRef.current.onChangeRaw?.('', '');
          return;
        }
        const displayValue = buildDisplayValue(processedValue, slots, slotChar, false);
        input.value = displayValue;
        displayValueRef.current = displayValue;
        setMaskedValue(displayValue);
      }
    };
    const onKeyDown = (event) => {
      const { slots, slotChar, transform } = getResolvedOptions(
        optionsRef.current,
        rawValueRef.current
      );
      const processedValue = processedRef.current;
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      const modifier = event.metaKey || (event.ctrlKey && !event.altKey);
      const key = event.key.toLowerCase();
      if (modifier && key === 'z' && !event.shiftKey) {
        event.preventDefault();
        const previousState = undoStackRef.current.pop();
        if (!previousState) {
          return;
        }
        redoStackRef.current.push({
          rawValue: rawValueRef.current,
          selectionStart: input.selectionStart ?? 0
        });
        applyHistoryState(previousState);
        return;
      }
      if (modifier && ((key === 'z' && event.shiftKey) || (key === 'y' && !event.shiftKey))) {
        event.preventDefault();
        const nextState = redoStackRef.current.pop();
        if (!nextState) {
          return;
        }
        undoStackRef.current.push({
          rawValue: rawValueRef.current,
          selectionStart: input.selectionStart ?? 0
        });
        applyHistoryState(nextState);
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
          const nextMaskedValue = applyMaskToRaw(afterRawValue, slots, slotChar, transform);
          pushUndoState();
          updateValue(nextMaskedValue, 0);
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
            slotChar,
            transform
          );
          pushUndoState();
          updateValue(nextMaskedValue, start);
          return;
        }
        if (start === 0) {
          return;
        }
        let deletePosition = start - 1;
        while (deletePosition >= 0 && slots[deletePosition]?.type === 'literal') {
          deletePosition--;
        }
        if (deletePosition < 0) {
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
        const nextMaskedValue = applyMaskToRaw(
          beforeRawValue + afterRawValue,
          slots,
          slotChar,
          transform
        );
        pushUndoState();
        updateValue(nextMaskedValue, deletePosition);
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
            slotChar,
            transform
          );
          pushUndoState();
          updateValue(nextMaskedValue, start);
          return;
        }
        let deletePosition = start;
        while (deletePosition < slots.length && slots[deletePosition]?.type === 'literal') {
          deletePosition++;
        }
        if (deletePosition >= processedValue.length) {
          return;
        }
        const beforeRawValue = extractRaw(processedValue.slice(0, start), slots.slice(0, start));
        const afterRawValue = extractRaw(
          processedValue.slice(deletePosition + 1),
          slots.slice(deletePosition + 1)
        );
        const nextMaskedValue = applyMaskToRaw(
          beforeRawValue + afterRawValue,
          slots,
          slotChar,
          transform
        );
        pushUndoState();
        updateValue(nextMaskedValue, start);
        return;
      }
      if (event.key === 'ArrowRight' && !event.shiftKey) {
        const nextPosition = findNextEditablePosition(start + 1, slots, input.value);
        if (nextPosition !== start + 1) {
          event.preventDefault();
          input.setSelectionRange(nextPosition, nextPosition);
        }
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
        return;
      }
      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        let insertPosition = Math.min(start, processedValue.length);
        while (insertPosition < slots.length && slots[insertPosition]?.type === 'literal') {
          insertPosition++;
        }
        if (insertPosition >= slots.length) {
          return;
        }
        const slot = slots[insertPosition];
        if (slot.type !== 'token') {
          return;
        }
        const char = transform ? transform(event.key) : event.key;
        if (!slot.pattern.test(char)) {
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
          slotChar,
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
    };
    const onPaste = (event) => {
      event.preventDefault();
      const pastedText = event.clipboardData?.getData('text') ?? '';
      const { slots, slotChar, transform } = getResolvedOptions(
        optionsRef.current,
        rawValueRef.current
      );
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
        slotChar,
        transform
      );
      pushUndoState();
      updateValue(nextMaskedValue);
      const maskedPrefix = applyMaskToRaw(beforeRawValue + pastedText, slots, slotChar, transform);
      const pasteEndPosition = Math.min(maskedPrefix.length, slots.length);
      if (input === document.activeElement) {
        input.setSelectionRange(pasteEndPosition, pasteEndPosition);
      }
    };
    input.addEventListener('input', onInput);
    input.addEventListener('focus', onFocus);
    input.addEventListener('blur', onBlur);
    input.addEventListener('mousedown', onMouseDown);
    input.addEventListener('mouseup', onMouseUp);
    input.addEventListener('keydown', onKeyDown);
    input.addEventListener('paste', onPaste);
    if (optionsRef.current.alwaysShowMask && !input.value) {
      const { slots, slotChar } = getResolvedOptions(optionsRef.current, '');
      const displayValue = buildDisplayValue('', slots, slotChar, true);
      input.value = displayValue;
      displayValueRef.current = displayValue;
      setMaskedValue(displayValue);
    }
    return () => {
      input.removeEventListener('input', onInput);
      input.removeEventListener('focus', onFocus);
      input.removeEventListener('blur', onBlur);
      input.removeEventListener('mousedown', onMouseDown);
      input.removeEventListener('mouseup', onMouseUp);
      input.removeEventListener('keydown', onKeyDown);
      input.removeEventListener('paste', onPaste);
    };
  }, [inputRef.state]);
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    if (options.invalid) {
      input.setAttribute('aria-invalid', 'true');
      return;
    }
    input.removeAttribute('aria-invalid');
  }, [inputRef.state, options.invalid]);
  const isComplete = checkComplete(
    processedRef.current,
    getResolvedOptions(optionsRef.current, rawValueRef.current).slots
  );
  return {
    ref: inputRef,
    value: maskedValue,
    rawValue,
    isComplete,
    set,
    reset
  };
};
