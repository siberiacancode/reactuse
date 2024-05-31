import { act, renderHook } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, expect } from 'vitest';

import { useCopyToClipboard } from './useCopyToClipboard';

afterEach(() => {
  vi.clearAllMocks();
});

it('Should be defined', () => {
  const { result } = renderHook(() => useCopyToClipboard());

  expect(result.current.value).toBeNull();
  expect(typeof result.current.copy).toBe('function');
});

describe('Should copy to clipboard using navigator', () => {
  beforeAll(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn()
      }
    });
  });

  afterAll(() => {
    Object.assign(navigator, {
      clipboard: {}
    });
  });

  it('Should copy value to clipboard', async () => {
    const copyText = 'Some string content';
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy(copyText);
    });

    const {
      clipboard: { writeText }
    } = navigator;

    expect(result.current.value).toBe(copyText);
    expect(writeText).toHaveBeenLastCalledWith(copyText);
    expect(writeText).toHaveBeenCalledOnce();
  });

  it('Should copy last value to clipboard', async () => {
    const copyText = 'Lorem ipsum dolor sit amet';
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy('Some string');
      await result.current.copy(copyText);
    });

    const {
      clipboard: { writeText }
    } = navigator;

    expect(result.current.value).toBe(copyText);
    expect(writeText).toHaveBeenCalledTimes(2);
    expect(writeText).toHaveBeenLastCalledWith(copyText);
  });
});

describe('Should copy to clipboard using legacy way', () => {
  beforeAll(() => {
    Object.assign(document, {
      execCommand: vi.fn()
    });
  });

  afterAll(() => {
    Object.assign(document, {
      execCommand: undefined
    });
  });

  it('Should copy value to clipboard using legacy way', async () => {
    const copyText = 'Some string content';
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy(copyText);
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { execCommand } = document;

    expect(result.current.value).toBe(copyText);
    expect(execCommand).toHaveBeenCalledOnce();
    expect(execCommand).toHaveBeenLastCalledWith('copy');
  });

  it('Should copy last value to clipboard using legacy way', async () => {
    const copyText = 'Lorem ipsum dolor sit amet';
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy('Some string');
      await result.current.copy(copyText);
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { execCommand } = document;

    expect(result.current.value).toBe(copyText);
    expect(execCommand).toHaveBeenCalledTimes(2);
    expect(execCommand).toHaveBeenLastCalledWith('copy');
  });
});
