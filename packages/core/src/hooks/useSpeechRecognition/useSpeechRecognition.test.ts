import { act, renderHook } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';

import { useSpeechRecognition } from './useSpeechRecognition';

const trigger = createTrigger<'end' | 'error' | 'result' | 'start', (...args: unknown[]) => void>();

class MockSpeechRecognition {
  continuous = false;
  grammars?: SpeechGrammarList;
  interimResults = false;
  lang = 'en-US';
  maxAlternatives = 1;
  private onresultInternal: ((event: SpeechRecognitionEvent) => void) | null = null;
  private onerrorInternal: ((event: SpeechRecognitionErrorEvent) => void) | null = null;
  private onendInternal: (() => void) | null = null;
  private onstartInternal: (() => void) | null = null;
  get onstart() {
    return this.onstartInternal;
  }
  set onstart(callback: (() => void) | null) {
    this.onstartInternal = callback;
    if (callback) trigger.add('start', callback as unknown as (...args: unknown[]) => void);
    else trigger.delete('start');
  }
  get onresult() {
    return this.onresultInternal;
  }
  set onresult(callback: ((event: SpeechRecognitionEvent) => void) | null) {
    this.onresultInternal = callback;
    if (callback) trigger.add('result', callback as unknown as (...args: unknown[]) => void);
    else trigger.delete('result');
  }
  get onend() {
    return this.onendInternal;
  }
  set onend(callback: (() => void) | null) {
    this.onendInternal = callback;
    if (callback) trigger.add('end', callback as unknown as (...args: unknown[]) => void);
    else trigger.delete('end');
  }
  get onerror() {
    return this.onerrorInternal;
  }
  set onerror(callback: ((event: SpeechRecognitionErrorEvent) => void) | null) {
    this.onerrorInternal = callback;
    if (callback) trigger.add('error', callback as unknown as (...args: unknown[]) => void);
    else trigger.delete('error');
  }
  start = () => this.onstart?.();
  stop = () => this.onend?.();
}

const createResultEvent = (transcript: string) =>
  ({
    resultIndex: 0,
    results: [
      {
        0: { transcript },
        length: 1
      }
    ]
  }) as unknown as SpeechRecognitionEvent;

const createErrorEvent = (message = 'Network error') =>
  ({
    error: 'network',
    message
  }) as SpeechRecognitionErrorEvent;

beforeEach(() => {
  Object.assign(globalThis.window, {
    SpeechRecognition: MockSpeechRecognition,
    webkitSpeechRecognition: MockSpeechRecognition
  });
});

it('Should use speech recognition', () => {
  const { result } = renderHook(useSpeechRecognition);

  expect(result.current.supported).toBeTruthy();
  expect(result.current.listening).toBeFalsy();
  expect(result.current.transcript).toBe('');
  expect(result.current.final).toBeFalsy();
  expect(result.current.error).toBeNull();
  expect(result.current.recognition).toBeInstanceOf(MockSpeechRecognition);
  expect(result.current.start).toBeTypeOf('function');
  expect(result.current.stop).toBeTypeOf('function');
  expect(result.current.toggle).toBeTypeOf('function');
});

it('Should use speech recognition on server side', () => {
  const { result } = renderHookServer(useSpeechRecognition);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.listening).toBeFalsy();
  expect(result.current.transcript).toBe('');
  expect(result.current.final).toBeFalsy();
  expect(result.current.error).toBeNull();
  expect(result.current.recognition).toBeUndefined();
  expect(result.current.start).toBeTypeOf('function');
  expect(result.current.stop).toBeTypeOf('function');
  expect(result.current.toggle).toBeTypeOf('function');
});

it('Should use speech recognition for unsupported', () => {
  Object.assign(globalThis.window, {
    SpeechRecognition: undefined,
    webkitSpeechRecognition: undefined
  });

  const { result } = renderHook(useSpeechRecognition);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.recognition).toBeUndefined();
});

it('Should bind options to recognition instance', () => {
  const grammars = {} as SpeechGrammarList;
  const { result } = renderHook(() =>
    useSpeechRecognition({
      continuous: true,
      interimResults: true,
      language: 'ru-RU',
      grammars,
      maxAlternatives: 3
    })
  );

  expect(result.current.recognition!.continuous).toBe(true);
  expect(result.current.recognition!.interimResults).toBe(true);
  expect(result.current.recognition!.lang).toBe('ru-RU');
  expect(result.current.recognition!.maxAlternatives).toBe(3);
  expect(result.current.recognition!.grammars).toBe(grammars);
});

it('Should start listening', () => {
  const onStart = vi.fn();
  const { result } = renderHook(() => useSpeechRecognition({ onStart }));

  act(() => result.current.start());

  expect(onStart).toHaveBeenCalledTimes(1);
  expect(result.current.listening).toBeTruthy();
  expect(result.current.final).toBeFalsy();
});

it('Should stop listening', () => {
  const onEnd = vi.fn();
  const { result } = renderHook(() => useSpeechRecognition({ onEnd }));

  act(() => result.current.start());

  expect(result.current.listening).toBeTruthy();
  expect(result.current.final).toBeFalsy();

  act(() => result.current.stop());

  expect(result.current.listening).toBeFalsy();
  expect(onEnd).toHaveBeenCalledTimes(1);
  expect(result.current.recognition!.lang).toBe('en-US');
});

it('Should toggle listening state', () => {
  const { result } = renderHook(useSpeechRecognition);

  act(() => result.current.toggle());

  expect(result.current.listening).toBeTruthy();
  expect(result.current.final).toBeFalsy();

  act(() => result.current.toggle());

  expect(result.current.listening).toBeFalsy();
  expect(result.current.recognition!.lang).toBe('en-US');
});

it('Should toggle listening state with value', () => {
  const { result } = renderHook(useSpeechRecognition);

  act(() => result.current.toggle(true));

  expect(result.current.listening).toBeTruthy();
  expect(result.current.final).toBeFalsy();

  act(() => result.current.toggle(false));

  expect(result.current.listening).toBeFalsy();
  expect(result.current.recognition!.lang).toBe('en-US');
});

it('Should handle result events', () => {
  const onResult = vi.fn();
  const { result } = renderHook(() => useSpeechRecognition({ onResult }));
  const event = createResultEvent('value');

  act(() => trigger.callback('result', event));

  expect(onResult).toHaveBeenCalledWith(event);
  expect(result.current.transcript).toBe('value');
  expect(result.current.listening).toBeFalsy();
  expect(result.current.error).toBeNull();
});

it('Should handle error events', () => {
  const onError = vi.fn();
  const { result } = renderHook(() => useSpeechRecognition({ onError }));
  const event = createErrorEvent();

  act(() => trigger.callback('error', event));

  expect(onError).toHaveBeenCalledWith(event);
  expect(result.current.listening).toBeFalsy();
  expect(result.current.error).toBe(event);
});
