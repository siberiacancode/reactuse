import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

import { createTrigger, renderHookServer } from "@/tests";
import { target } from "@/utils/helpers";

import type { StateRef } from "../useRefState/useRefState";
import type { UseActiveElementReturn } from "./useActiveElement";

import { useActiveElement } from "./useActiveElement";

const trigger = createTrigger<Element, MutationCallback>();

const mockMutationObserverObserve = vi.fn();
const mockMutationObserverDisconnect = vi.fn();

class MockMutationObserver {
  constructor(callback: MutationCallback) {
    this.callback = callback;
  }

  callback: MutationCallback;

  observe = (element: Element, options?: MutationObserverInit) => {
    trigger.add(element, this.callback);
    mockMutationObserverObserve(element, options);
  };

  disconnect = () => mockMutationObserverDisconnect();
}

globalThis.MutationObserver = MockMutationObserver as any;

beforeEach(trigger.clear);
afterEach(vi.clearAllMocks);

const targets = [
  undefined,
  target("#target"),
  target(document.getElementById("target")!),
  target(() => document.getElementById("target")!),
  { current: document.getElementById("target") },
];

const element = document.getElementById("target") as HTMLDivElement;

targets.forEach((target) => {
  describe(`${target}`, () => {
    it("Should use active element", () => {
      const { result } = renderHook(() => {
        if (target)
          return useActiveElement(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
            value: UseActiveElementReturn<HTMLDivElement>;
          };
        return useActiveElement<HTMLDivElement>();
      });

      if (!target) {
        expect(result.current.ref).toBeTypeOf("function");
        expect(result.current.value).toBeNull();
      } else {
        expect(result.current).toBeNull();
      }
    });

    it("Should use active element on server side", () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useActiveElement(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
            value: UseActiveElementReturn<HTMLDivElement>;
          };
        return useActiveElement<HTMLDivElement>();
      });

      if (!target) {
        expect(result.current.ref).toBeTypeOf("function");
        expect(result.current.value).toBeNull();
      } else {
        expect(result.current).toBeNull();
      }
    });

    it("Should set active element on focus", () => {
      const { result } = renderHook(() => {
        if (target)
          return useActiveElement(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
            value: UseActiveElementReturn<HTMLDivElement>;
          };
        return useActiveElement<HTMLDivElement>();
      });

      if (!target) {
        act(() => result.current.ref(element));
      }

      if (!target) {
        expect(result.current.value).toBeNull();
      } else {
        expect(result.current).toBeNull();
      }

      act(() => {
        element.focus();
        element.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
      });

      if (!target) {
        expect(result.current.value).toBe(element);
      } else {
        expect(result.current).toBe(element);
      }
    });

    it("Should unset active element on blur", () => {
      const { result } = renderHook(() => {
        if (target)
          return useActiveElement(target) as unknown as {
            ref: StateRef<Element>;
            value: UseActiveElementReturn<HTMLDivElement>;
          };
        return useActiveElement<HTMLDivElement>();
      });

      if (!target) {
        act(() => "ref" in result.current! && result.current.ref(element));
      }

      if (!target && "value" in result.current!) {
        expect(result.current.value).toBeNull();
      } else {
        expect(result.current).toBeNull();
      }

      act(() => {
        element.focus();
        element.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
      });

      if (!target && "value" in result.current!) {
        expect(result.current.value).toBe(element);
      } else {
        expect(result.current).toBe(element);
      }

      act(() => element.blur());

      if (!target && "value" in result.current!) {
        expect(result.current.value).toBe(document.activeElement);
      } else {
        expect(result.current).toBe(document.activeElement);
      }
    });

    it("Should handle target changes", () => {
      const { rerender } = renderHook(
        (target) => {
          if (target)
            return useActiveElement(target) as unknown as {
              ref: StateRef<HTMLDivElement>;
            };
          return useActiveElement<HTMLDivElement>();
        },
        { initialProps: target }
      );

      expect(mockMutationObserverObserve).toHaveBeenCalledTimes(1);

      rerender({ current: document.getElementById("target") });

      expect(mockMutationObserverObserve).toHaveBeenCalledTimes(2);
      expect(mockMutationObserverDisconnect).toHaveBeenCalledTimes(1);
    });

    it("Should clean up on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(element, "removeEventListener");

      const { result, unmount } = renderHook(() => {
        if (target)
          return useActiveElement(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
            value: UseActiveElementReturn<HTMLDivElement>;
          };
        return useActiveElement<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(mockMutationObserverDisconnect).toHaveBeenCalled();
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "focus",
        expect.any(Function),
        true
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "blur",
        expect.any(Function),
        true
      );
    });
  });
});
