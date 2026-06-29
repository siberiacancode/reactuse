import { useEffect, useRef } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
const KEY_NAME_MAP = {
  ' ': 'space',
  arrowleft: 'arrowleft',
  arrowright: 'arrowright',
  arrowup: 'arrowup',
  arrowdown: 'arrowdown',
  escape: 'escape',
  esc: 'escape',
  enter: 'enter',
  return: 'enter',
  tab: 'tab',
  backspace: 'backspace',
  delete: 'delete',
  insert: 'insert',
  home: 'home',
  end: 'end',
  pageup: 'pageup',
  pagedown: 'pagedown',
  '+': 'plus',
  '-': 'minus',
  '*': 'asterisk',
  '/': 'slash'
};
const normalizeKey = (key) => {
  const lowerKey = key
    .replace(/^Key/, '')
    .replace(/^Digit/, '')
    .toLowerCase();
  return KEY_NAME_MAP[lowerKey] ?? lowerKey;
};
export const parseHotkey = (hotkey) => {
  const keys = hotkey
    .toLowerCase()
    .split('+')
    .map((part) => part.trim());
  const modifiers = {
    alt: keys.includes('alt'),
    ctrl: keys.includes('ctrl') || keys.includes('control'),
    meta: keys.includes('meta') || keys.includes('cmd') || keys.includes('command'),
    mod: keys.includes('mod'),
    shift: keys.includes('shift')
  };
  const reservedKeys = ['alt', 'ctrl', 'control', 'meta', 'cmd', 'command', 'shift', 'mod'];
  const freeKey = keys.find((key) => key && !reservedKeys.includes(key));
  return {
    ...modifiers,
    key: freeKey
  };
};
const isHotkeyMatch = (hotkey, event) => {
  const { alt, ctrl, meta, mod, shift, key } = hotkey;
  const { altKey, ctrlKey, metaKey, shiftKey, key: pressedKey, code: pressedCode } = event;
  if (alt !== altKey) {
    return false;
  }
  if (mod) {
    if (!ctrlKey && !metaKey) {
      return false;
    }
  } else {
    if (ctrl !== ctrlKey) {
      return false;
    }
    if (meta !== metaKey) {
      return false;
    }
  }
  if (shift !== shiftKey) {
    return false;
  }
  if (key && normalizeKey(pressedKey ?? pressedCode) === normalizeKey(key)) {
    return true;
  }
  return false;
};
export const getHotkeyMatcher = (hotkey) => (event) => isHotkeyMatch(parseHotkey(hotkey), event);
/**
 * @name useHotkeys
 * @description - Hook that listens for hotkeys
 * @category Sensors
 * @usage medium
 *
 * @overload
 * @param {HookTarget} [target=window] The target element to attach the event listener to
 * @param {string} hotkeys The hotkey to listen for
 * @param {UseHotkeysOptions} [options] The options for the hook
 * @param {boolean} [options.enabled=true] Enable or disable the event listeners
 * @param {(event: KeyboardEvent) => void} [options.onChange] The callback function to execute when hotkey is pressed
 * @returns {void}
 *
 * @example
 * useHotkeys(ref, 'ctrl+a', { onChange: () => console.log('hotkey pressed') });
 *
 * @overload
 * @param {HookTarget} [target=window] The target element to attach the event listener to
 * @param {string} hotkeys The hotkey to listen for
 * @param {(event: KeyboardEvent) => void} callback The callback function to execute when hotkey is pressed
 * @param {boolean} [options.enabled=true] Enable or disable the event listeners
 * @returns {void}
 *
 * @example
 * useHotkeys(ref, 'ctrl+a', () => console.log('hotkey pressed'));
 *
 * @overload
 * @template Target The target element
 * @param {string} hotkeys The hotkey to listen for
 * @param {UseHotkeysOptions} [options] The options for the hook
 * @param {boolean} [options.enabled=true] Enable or disable the event listeners
 * @param {(event: KeyboardEvent) => void} [options.onChange] The callback function to execute when hotkey is pressed
 * @returns {StateRef<Target>} A reference to the target element
 *
 * @example
 * const ref = useHotkeys('ctrl+a', { onChange: () => console.log('hotkey pressed') });
 *
 * @overload
 * @template Target The target element
 * @param {string} hotkeys The hotkey to listen for
 * @param {(event: KeyboardEvent) => void} callback The callback function to execute when hotkey is pressed
 * @param {boolean} [options.enabled=true] Enable or disable the event listeners
 * @returns {StateRef<Target>} A reference to the target element
 *
 * @example
 * const ref = useHotkeys('ctrl+a', () => console.log('hotkey pressed'));
 */
export const useHotkeys = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const hotkeys = target ? params[1] : params[0];
  const options = target
    ? typeof params[2] === 'object'
      ? params[2]
      : { ...params[3], onChange: params[2] }
    : typeof params[1] === 'object'
      ? params[1]
      : { ...params[2], onChange: params[1] };
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const internalRef = useRefState();
  const enabled = options?.enabled ?? true;
  useEffect(() => {
    if (!enabled) return;
    const eventTarget = (target ? isTarget.getElement(target) : internalRef.current) ?? window;
    if (!eventTarget) return;
    const matchers = hotkeys
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean)
      .map(getHotkeyMatcher);
    const onKeyDown = (event) => {
      if (!enabled) return;
      const isMatch = matchers.some((matcher) => matcher(event));
      if (!isMatch) return;
      event.preventDefault();
      optionsRef.current?.onChange?.(event);
    };
    eventTarget.addEventListener('keydown', onKeyDown);
    return () => {
      eventTarget.removeEventListener('keydown', onKeyDown);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state, enabled, hotkeys]);
  if (target) return;
  return internalRef;
};
