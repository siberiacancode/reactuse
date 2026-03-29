import { useEffect, useRef } from 'react';
import { isTarget } from '@/utils/helpers';
import { useEvent } from '../useEvent/useEvent';
import { useRefState } from '../useRefState/useRefState';
export const isHotkeyMatch = (hotkey, keys) =>
  hotkey
    .toLowerCase()
    .split(/[+_,\-]/g)
    .map((key) => key.trim())
    .every((key) =>
      keys.find(
        (updatedKey) =>
          key === updatedKey.code.toLocaleLowerCase() ||
          key === updatedKey.key.toLocaleLowerCase() ||
          key === updatedKey.alias.toLocaleLowerCase()
      )
    );
/**
 * @name useHotkeys
 * @description - Hook that listens for hotkeys
 * @category Sensors
 * @usage medium
 *
 * @overload
 * @param {HookTarget} [target=window] The target element to attach the event listener to
 * @param {string} hotkeys The hotkey to listen for
 * @param {(event: KeyboardEvent) => void} callback The callback function to execute when hotkey is pressed
 * @param {Record<string, string>} [options.alias] Alias map for hotkeys
 * @param {boolean} [options.enabled=true] Enable or disable the event listeners
 * @returns {void}
 *
 * @example
 * useHotkeys(ref, 'ctrl+a', () => console.log('hotkey pressed'));
 * @example
 * useHotkeys(ref, 'ctrl+a, ctrl+b', () => console.log('hotkey pressed'));
 *
 * @overload
 * @template Target The target element
 * @param {string} hotkeys The hotkey to listen for
 * @param {(event: KeyboardEvent) => void} callback The callback function to execute when hotkey is pressed
 * @param {Record<string, string>} [options.alias] Alias map for hotkeys
 * @param {boolean} [options.enabled=true] Enable or disable the event listeners
 * @returns {StateRef<Target>} A reference to the target element
 *
 * @example
 * const ref = useHotkeys('ctrl+a', () => console.log('hotkey pressed'));
 * @example
 * const ref = useHotkeys('ctrl+a, ctrl+b', () => console.log('hotkey pressed'));
 */
export const useHotkeys = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const hotkeys = target ? params[1] : params[0];
  const callback = target ? params[2] : params[1];
  const options = target ? params[3] : params[2];
  const internalRef = useRefState(window);
  const keysRef = useRef([]);
  const enabled = options?.enabled ?? true;
  const onKeyDown = useEvent((event) => {
    if (!enabled) return;
    if (keysRef.current.some(({ code }) => code === event.code)) return;
    const alias = options?.alias?.[event.key] ?? event.code;
    const updatedKeys = [...keysRef.current, { key: event.key, code: event.code, alias }];
    keysRef.current = updatedKeys;
    const hotkeysList = hotkeys.split(',').map((h) => h.trim());
    const isMatch = hotkeysList.some((hotkey) => isHotkeyMatch(hotkey, updatedKeys));
    if (!isMatch) return;
    event.preventDefault();
    callback(event);
  });
  const onKeyUp = useEvent((event) => {
    if (!enabled) return;
    keysRef.current = keysRef.current.filter(({ code }) => code !== event.code);
  });
  useEffect(() => {
    keysRef.current = [];
    if (!target && !internalRef.state && !enabled) return;
    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;
    element.addEventListener('keydown', onKeyDown);
    element.addEventListener('keyup', onKeyUp);
    return () => {
      element.removeEventListener('keydown', onKeyDown);
      element.removeEventListener('keyup', onKeyUp);
    };
  }, [
    target && isTarget.getRawElement(target),
    internalRef.state,
    enabled,
    hotkeys,
    onKeyDown,
    onKeyUp
  ]);
  if (target) return;
  return internalRef;
};
