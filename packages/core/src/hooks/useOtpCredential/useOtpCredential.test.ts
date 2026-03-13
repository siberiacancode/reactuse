import { act, renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';

import { renderHookServer } from '@/tests';

import { useOtpCredential } from './useOtpCredential';

const mockGet = vi.fn();

beforeEach(() => {
  Object.assign(navigator, {
    OTPCredential: vi.fn(),
    credentials: {
      get: mockGet
    }
  });
});

it('Should use otp credential', () => {
  const { result } = renderHook(useOtpCredential);

  expect(result.current.supported).toBeTruthy();
  expect(result.current.get).toBeTypeOf('function');
  expect(result.current.abort).toBeTypeOf('function');
});

it('Should use otp credential on server side', () => {
  const { result } = renderHookServer(useOtpCredential);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.get).toBeTypeOf('function');
  expect(result.current.abort).toBeTypeOf('function');
});

it('Should use otp credential for unsupported', async () => {
  delete (navigator as any).OTPCredential;

  const { result } = renderHook(useOtpCredential);

  expect(result.current.supported).toBeFalsy();
});

it('Should request otp credential and call success callback', async () => {
  const credential = { code: '1' } as Credential;
  mockGet.mockResolvedValueOnce(credential);
  const callback = vi.fn();

  const { result } = renderHook(() => useOtpCredential(callback));

  await act(async () => {
    const value = await result.current.get();
    expect(value).toBe(credential);
  });

  expect(result.current.supported).toBeTruthy();
  expect(callback).toHaveBeenCalledWith(credential);
  expect(mockGet).toHaveBeenCalledWith({
    otp: { transport: ['sms'] },
    signal: expect.any(AbortSignal)
  });
});

it('Should call error callback on request failure', async () => {
  const error = new Error('otp failed');
  mockGet.mockRejectedValueOnce(error);
  const onError = vi.fn();

  const { result } = renderHook(() => useOtpCredential({ onError }));

  await act(async () => {
    await result.current.get();
  });

  expect(onError).toHaveBeenCalledOnce();
});

it('Should triggered onSuccess callback', async () => {
  const onSuccess = vi.fn();
  const { result } = renderHook(() => useOtpCredential({ onSuccess }));

  await act(async () => {
    await result.current.get();
  });

  expect(onSuccess).toHaveBeenCalledOnce();
});

it('Should triggered onError callback', async () => {
  const onError = vi.fn();
  mockGet.mockRejectedValueOnce(new Error('failed'));
  const { result } = renderHook(() => useOtpCredential({ onError }));

  await act(async () => {
    await result.current.get();
  });

  expect(onError).toHaveBeenCalledOnce();
});
