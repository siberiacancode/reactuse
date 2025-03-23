import { act, renderHook } from '@testing-library/react';

import { useSpeechRecognition } from './useSpeechRecognition';

describe('useSpeechRecognition', () => {
  describe('in unsupported environment', () => {
    afterEach(() => void vi.unstubAllGlobals());

    it('should return supported as false when SpeechRecognition is not available', () => {
      vi.stubGlobal('SpeechRecognition', undefined);
      vi.stubGlobal('webkitSpeechRecognition', undefined);

      const { result } = renderHook(() => useSpeechRecognition({}));
      expect(result.current.supported).toBeFalsy();
    });

    it('should return supported as false when SpeechGrammarList is not available', () => {
      vi.stubGlobal('SpeechGrammarList', undefined);
      vi.stubGlobal('webkitSpeechGrammarList', undefined);

      const { result } = renderHook(() => useSpeechRecognition({}));
      expect(result.current.supported).toBeFalsy();
    });
  });

  describe('in supported environment', () => {
    let fakeInstance: FakeSpeechRecognition | null = null;

    class FakeSpeechRecognition {
      onstart: (() => void) | null = null;
      onend: (() => void) | null = null;
      onerror: ((event: SpeechRecognitionErrorEvent) => void) | null = null;
      onresult: ((event: SpeechRecognitionEvent) => void) | null = null;

      continuous: boolean = false;
      grammars: SpeechGrammarList | undefined = undefined;
      interimResults: boolean = false;
      lang: string = 'en-US';
      maxAlternatives: number = 1;

      start = vi.fn();
      stop = vi.fn();
      abort = vi.fn();

      constructor() {
        // eslint-disable-next-line ts/no-this-alias
        fakeInstance = this;
      }
    }

    class FakeSpeechGrammarList {}

    beforeEach(() => {
      vi.stubGlobal('SpeechRecognition', FakeSpeechRecognition);
      vi.stubGlobal('SpeechGrammarList', FakeSpeechGrammarList);
      fakeInstance = null;
    });

    afterEach(() => void vi.unstubAllGlobals());

    it('should set options on the SpeechRecognition instance when started', () => {
      const fakeGrammars = {} as SpeechGrammarList;
      const { result } = renderHook(() =>
        useSpeechRecognition({
          continuous: true,
          grammars: fakeGrammars,
          interimResults: true,
          language: 'en-US',
          maxAlternatives: 2
        })
      );

      act(() => result.current.start());

      expect(fakeInstance).not.toBeNull();
      expect(fakeInstance!.continuous).toBeTruthy();
      expect(fakeInstance!.grammars).toEqual(fakeGrammars);
      expect(fakeInstance!.interimResults).toBeTruthy();
      expect(fakeInstance!.lang).toEqual('en-US');
      expect(fakeInstance!.maxAlternatives).toEqual(2);
      expect(fakeInstance!.start).toHaveBeenCalled();
    });

    it('should call onStart callback and set listening true when recognition starts', () => {
      const onStart = vi.fn();
      const { result } = renderHook(() => useSpeechRecognition({ onStart }));

      act(() => result.current.start());
      act(() => fakeInstance!.onstart && fakeInstance!.onstart());

      expect(onStart).toHaveBeenCalled();
      expect(result.current.listening).toBeTruthy();
    });

    it('should update transcript and call onResult on result event (final result)', () => {
      const onResult = vi.fn();
      const { result } = renderHook(() => useSpeechRecognition({ onResult }));

      act(() => result.current.start());
      act(() => fakeInstance!.onstart && fakeInstance!.onstart());

      const fakeResult = Object.assign([{ transcript: 'hello ' }], { isFinal: true });
      const fakeEvent = { results: [fakeResult] } as any as SpeechRecognitionEvent;

      act(() => fakeInstance!.onresult && fakeInstance!.onresult(fakeEvent));

      expect(result.current.transcript).toEqual('hello ');
      expect(result.current.interimTranscript).toEqual('');
      expect(onResult).toHaveBeenCalledWith('hello ', true);
    });

    it('should update transcript with interim results when enabled', () => {
      const onResult = vi.fn();
      const { result } = renderHook(() =>
        useSpeechRecognition({
          onResult,
          interimResults: true
        })
      );

      act(() => result.current.start());
      act(() => fakeInstance!.onstart && fakeInstance!.onstart());

      const fakeResult = Object.assign([{ transcript: 'interim ' }], { isFinal: false });
      const fakeEvent = { results: [fakeResult] } as any as SpeechRecognitionEvent;

      act(() => fakeInstance!.onresult && fakeInstance!.onresult(fakeEvent));

      expect(result.current.transcript).toEqual('');
      expect(result.current.interimTranscript).toEqual('interim ');
      expect(onResult).toHaveBeenCalledWith('interim ', false);
    });

    it('should call onResult with alternatives when maxAlternatives > 1', () => {
      const onResult = vi.fn();
      const { result } = renderHook(() =>
        useSpeechRecognition({
          onResult,
          maxAlternatives: 2
        })
      );

      act(() => result.current.start());
      act(() => fakeInstance!.onstart && fakeInstance!.onstart());

      const fakeResult = Object.assign([{ transcript: 'hi' }, { transcript: 'hey' }], {
        isFinal: true
      });
      const fakeEvent = { results: [fakeResult] } as any as SpeechRecognitionEvent;

      act(() => fakeInstance!.onresult && fakeInstance!.onresult(fakeEvent));

      expect(result.current.transcript).toEqual('hi');
      expect(onResult).toHaveBeenCalledWith('hi', true, ['hi', 'hey']);
    });

    it('should update error and call onError when an error event occurs', () => {
      const onError = vi.fn();
      const { result } = renderHook(() => useSpeechRecognition({ onError }));

      act(() => result.current.start());
      const fakeError = { error: 'network' } as SpeechRecognitionErrorEvent;
      act(() => fakeInstance!.onerror && fakeInstance!.onerror(fakeError));

      expect(result.current.error).toEqual(fakeError);
      expect(result.current.listening).toBeFalsy();
      expect(onError).toHaveBeenCalledWith(fakeError);
    });

    it('should update listening state and call onEnd when recognition ends', () => {
      const onEnd = vi.fn();
      const { result } = renderHook(() => useSpeechRecognition({ onEnd }));

      act(() => result.current.start());
      act(() => fakeInstance!.onstart && fakeInstance!.onstart());
      act(() => fakeInstance!.onend && fakeInstance!.onend());

      expect(result.current.listening).toBeFalsy();
      expect(result.current.interimTranscript).toEqual('');
      expect(onEnd).toHaveBeenCalled();
    });

    it('should call stop on the recognition instance when stop is called', () => {
      const { result } = renderHook(() => useSpeechRecognition({}));

      act(() => result.current.start());
      act(() => result.current.stop());
      expect(fakeInstance!.stop).toHaveBeenCalled();
    });

    it('should call abort on the recognition instance when abort is called', () => {
      const onEnd = vi.fn();
      const { result } = renderHook(() => useSpeechRecognition({ onEnd }));

      act(() => result.current.start());
      act(() => result.current.abort());
      expect(fakeInstance!.abort).toHaveBeenCalled();
      expect(result.current.listening).toBeFalsy();
      expect(onEnd).toHaveBeenCalled();
    });

    it('should reset error and transcript when reset is called', () => {
      const { result } = renderHook(() => useSpeechRecognition({}));

      act(() => result.current.start());
      const fakeError = { error: 'test' } as any as SpeechRecognitionErrorEvent;
      act(() => fakeInstance!.onerror && fakeInstance!.onerror(fakeError));
      const fakeResult = Object.assign([{ transcript: 'hello' }], { isFinal: true });
      const fakeEvent = { results: [fakeResult] } as any as SpeechRecognitionEvent;
      act(() => fakeInstance!.onresult && fakeInstance!.onresult(fakeEvent));
      expect(result.current.error).toEqual(fakeError);
      expect(result.current.transcript).toEqual('hello');

      act(() => result.current.reset());
      expect(result.current.error).toBeNull();
      expect(result.current.transcript).toEqual('');
    });

    it('should abort recognition on unmount', () => {
      const onEnd = vi.fn();
      const { result, unmount } = renderHook(() => useSpeechRecognition({ onEnd }));

      act(() => result.current.start());
      unmount();
      expect(fakeInstance!.abort).toHaveBeenCalled();
    });
  });
});
