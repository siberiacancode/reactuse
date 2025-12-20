import { act, renderHook } from "@testing-library/react";
import { useTextSelection, getRangesSelection } from "./useTextSelection";

const mockGetBoundingClientRect = vi.fn();

it("Should return initial selecition state", () => {
  const selection = window.getSelection();

  const { result } = renderHook(() => useTextSelection());

  expect(result.current.selection).toBe(selection);
  expect(result.current.text).toBe(selection?.toString() ?? "");
  expect(result.current.ranges).toEqual(
    selection ? getRangesSelection(selection) : []
  );
});

it("Should handle selection change", () => {
  const { result } = renderHook(() => useTextSelection());

  const range = document.createRange();
  const textNode = document.createTextNode("hello_world");
  document.body.appendChild(textNode);

  range.selectNodeContents(textNode);

  range.getBoundingClientRect = mockGetBoundingClientRect;

  const selection = window.getSelection()!;

  act(() => {
    selection.removeAllRanges();
    selection.addRange(range);
    document.dispatchEvent(new Event("selectionchange"));
  });

  expect(result.current.text).toBe("hello_world");
  expect(result.current.ranges.length).toBe(1);
  expect(result.current.rects.length).toBe(1);
});

it("Should add and remove selectionchange listener", () => {
  const addSpy = vi.spyOn(document, "addEventListener");
  const removeSpy = vi.spyOn(document, "removeEventListener");

  const { unmount } = renderHook(() => useTextSelection());

  expect(addSpy).toHaveBeenCalledWith("selectionchange", expect.any(Function));

  unmount();

  expect(removeSpy).toHaveBeenCalledWith(
    "selectionchange",
    expect.any(Function)
  );
});
