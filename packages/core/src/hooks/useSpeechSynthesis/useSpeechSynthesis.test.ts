import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useSpeechSynthesis } from './useSpeechSynthesis';

class MockSpeechSynthesisUtterance {
  text: string;
  lang = '';
  pitch = 1;
  rate = 1;
  volume = 1;
  voice: SpeechSynthesisVoice | null = null;

  constructor(text = '') {
    this.text = text;
  }
}

const speak = vi.fn();
const cancel = vi.fn();
const pause = vi.fn();
const resume = vi.fn();
const mockSpeechSynthesis = { speak, cancel, pause, resume };

beforeEach(() => {
  Object.defineProperty(globalThis.window, 'speechSynthesis', {
    writable: true,
    value: mockSpeechSynthesis
  });
  Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', {
    writable: true,
    value: MockSpeechSynthesisUtterance
  });
});

it('Should use speech synthesis', () => {
  const { result } = renderHook(useSpeechSynthesis);

  expect(result.current.supported).toBeTruthy();
  expect(result.current.status).toBe('init');
  expect(result.current.utterance).toBeInstanceOf(MockSpeechSynthesisUtterance);
  expect(result.current.playing).toBeFalsy();
  expect(result.current.error).toBeUndefined();
  expect(result.current.stop).toBeTypeOf('function');
  expect(result.current.toggle).toBeTypeOf('function');
  expect(result.current.speak).toBeTypeOf('function');
  expect(result.current.resume).toBeTypeOf('function');
  expect(result.current.pause).toBeTypeOf('function');
});

it('Should use speech synthesis on server side', () => {
  const { result } = renderHookServer(useSpeechSynthesis);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.status).toBe('init');
  expect(result.current.utterance).toBeUndefined();
  expect(result.current.playing).toBeFalsy();
  expect(result.current.error).toBeUndefined();
  expect(result.current.stop).toBeTypeOf('function');
  expect(result.current.toggle).toBeTypeOf('function');
  expect(result.current.speak).toBeTypeOf('function');
  expect(result.current.resume).toBeTypeOf('function');
  expect(result.current.pause).toBeTypeOf('function');
});

it('Should correct return for unsupported broadcast channel', () => {
  Object.assign(globalThis.window, {
    speechSynthesis: undefined
  });
  const { result } = renderHook(useSpeechSynthesis);

  expect(result.current.supported).toBeFalsy();
});

it('Should bind options to utterance', () => {
  const { result } = renderHook(() =>
    useSpeechSynthesis({
      text: 'hello',
      lang: 'ru',
      pitch: 2,
      rate: 1.2,
      volume: 0.5,
      voice: { name: 'voice' } as SpeechSynthesisVoice
    })
  );

  expect(result.current.utterance!.text).toBe('hello');
  expect(result.current.utterance!.lang).toBe('ru');
  expect(result.current.utterance!.pitch).toBe(2);
  expect(result.current.utterance!.rate).toBe(1.2);
  expect(result.current.utterance!.volume).toBe(0.5);
  expect(result.current.utterance!.voice).toStrictEqual({ name: 'voice' } as SpeechSynthesisVoice);
});

it('should toggle speech synthesis', () => {
  const { result } = renderHook(useSpeechSynthesis);

  act(result.current.toggle);
  expect(mockSpeechSynthesis.resume).toHaveBeenCalled();
  expect(result.current.playing).toBeTruthy();

  act(result.current.toggle);
  expect(mockSpeechSynthesis.pause).toHaveBeenCalled();
  expect(result.current.playing).toBeFalsy();
});

it('should pause speech synthesis', () => {
  const { result } = renderHook(useSpeechSynthesis);

  act(result.current.speak);

  expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
  expect(result.current.playing).toBeTruthy();

  act(result.current.pause);

  expect(mockSpeechSynthesis.pause).toHaveBeenCalled();
  expect(result.current.playing).toBeFalsy();
});

it('should resume speech synthesis', () => {
  const { result } = renderHook(useSpeechSynthesis);

  act(result.current.resume);

  expect(mockSpeechSynthesis.resume).toHaveBeenCalled();
  expect(result.current.playing).toBeTruthy();
});

it('should stop speech synthesis', () => {
  const { result } = renderHook(useSpeechSynthesis);

  act(result.current.speak);

  expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
  expect(result.current.playing).toBeTruthy();

  act(result.current.stop);

  expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
  expect(result.current.playing).toBeFalsy();
});

it('Should cleanup on unmount', () => {
  const { unmount } = renderHook(useSpeechSynthesis);

  unmount();

  expect(mockSpeechSynthesis.cancel).toHaveBeenCalledTimes(1);
});
