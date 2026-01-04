import { act, fireEvent, renderHook } from "@testing-library/react";
import { renderHookServer } from "@/tests";

import { useTextareaAutosize } from "./useTextareaAutosize";

if (typeof document !== "undefined") {
  const target = document.createElement("textarea");
  target.id = "textarea-target";
  document.body.appendChild(target);
}

const element = document.getElementById(
  "textarea-target"
) as HTMLTextAreaElement;

it("Should use textarea autosize", () => {
  const { result } = renderHook(useTextareaAutosize);

  act(() => result.current.ref(element));

  expect(result.current.value).toEqual("");
  expect(result.current.setValue).toBeTypeOf("function");
  expect(result.current.clear).toBeTypeOf("function");
});

it("Should use textarea autosize on server side", () => {
  const { result } = renderHookServer(useTextareaAutosize);

  act(() => result.current.ref(element));

  expect(result.current.value).toEqual("");
  expect(result.current.setValue).toBeTypeOf("function");
  expect(result.current.clear).toBeTypeOf("function");
});

it("Should set initial value in textarea", () => {
  const { result } = renderHook(() => useTextareaAutosize("initial"));

  act(() => result.current.ref(element));
  expect(result.current.value).toEqual("initial");
});

it("Should update and clear value in textarea", () => {
  const { result } = renderHook(() => useTextareaAutosize("initial"));

  act(() => {
    result.current.ref(element);
    result.current.setValue("initial_2");
  });

  expect(result.current.value).toEqual("initial_2");

  act(() => {
    result.current.clear();
  });

  expect(result.current.value).toEqual("");
});

it("Should call callback on resize", () => {
  const onResize = vi.fn();
  vi.useFakeTimers();

  const { result } = renderHook(() => useTextareaAutosize({ onResize }));

  act(() => result.current.ref(element));
  expect(onResize).toHaveBeenCalledTimes(1);

  fireEvent.input(element, { target: { value: "hello_world" } });

  vi.runAllTimers();
  expect(onResize).toHaveBeenCalledTimes(3);
  vi.useRealTimers();
});

it("Should cleanup on unmount", () => {
  const removeEventListenerSpy = vi.spyOn(element, "removeEventListener");
  const { result, unmount } = renderHook(useTextareaAutosize);

  act(() => result.current.ref(element));

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith(
    "input",
    expect.any(Function)
  );
  expect(removeEventListenerSpy).toHaveBeenCalledWith(
    "resize",
    expect.any(Function)
  );
});
