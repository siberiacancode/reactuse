import { useCallback, useEffect, useRef, useState } from 'react';
const getSpeechRecognitionAPI = () => {
  const SpeechRecognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
  const SpeechGrammarList = window.SpeechGrammarList ?? window.webkitSpeechGrammarList;
  const supported = Boolean(SpeechRecognition && SpeechGrammarList);
  return { SpeechRecognition, SpeechGrammarList, supported };
};
const DEFAULT_TRANSCRIPT = {
  transcript: '',
  interimTranscript: ''
};
/**
 * @name useSpeechRecognition
 * @description - Hook that provides a streamlined interface for incorporating speech-to-text functionality.
 * @category Sensor
 *
 * @param {UseSpeechRecognitionOptions} [options] Configuration options for speech recognition.
 * @param {boolean} [options.continuous=false] Whether recognition should continue after pauses.
 * @param {SpeechGrammarList} [options.grammars] A list of grammar rules.
 * @param {boolean} [options.interimResults=false] Whether interim results should be provided.
 * @param {string} [options.language="en-US"] The language for recognition, as a valid BCP 47 tag.
 * @param {number} [options.maxAlternatives=1] The maximum number of alternative transcripts to return.
 * @param {() => void} [options.onEnd] Callback invoked when recognition stops.
 * @param {(error: SpeechRecognitionErrorEvent) => void} [options.onError] Callback invoked on a recognition error.
 * @param {(transcript: string, isFinal: boolean, alternatives?: string[]) => void} [options.onResult] Callback invoked when recognition produces a result. When interim results are enabled, the callback is invoked with the interim transcript if the result is not final.
 * @param {() => void} [options.onStart] Callback invoked when recognition starts.
 * @returns {UseSpeechRecognitionReturn} State, utility methods, and callbacks for interacting with the speech recognition API.
 *
 * @example
 * const { start, stop, reset } = useSpeechRecognition({
 *   language: 'en-US',
 *   interimResults: true,
 *   onResult: (transcript, isFinal) => console.log(transcript, isFinal)
 * });
 */
export const useSpeechRecognition = (options = {}) => {
  const { supported, SpeechRecognition, SpeechGrammarList } = getSpeechRecognitionAPI();
  const speechRecognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState(DEFAULT_TRANSCRIPT);
  const {
    onEnd: onEndCallback,
    onError: onErrorCallback,
    onResult: onResultCallback,
    onStart: onStartCallback
  } = options;
  const {
    continuous = false,
    grammars = supported ? new SpeechGrammarList() : undefined,
    interimResults = false,
    language = 'en-US',
    maxAlternatives = 1
  } = options;
  const reset = useCallback(() => {
    setError(null);
    setTranscript(DEFAULT_TRANSCRIPT);
  }, []);
  const onStart = useCallback(() => {
    reset();
    setListening(true);
    onStartCallback?.();
  }, [onStartCallback, reset]);
  const onEnd = useCallback(() => {
    setTranscript((prev) => ({ ...prev, interimTranscript: '' }));
    setListening(false);
    onEndCallback?.();
    speechRecognitionRef.current = null;
  }, [onEndCallback]);
  const onResult = useCallback(
    (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      let isFinal = false;
      let alternativesForLastResult = null;
      const results = Array.from(event.results);
      results.forEach((recognitionResult, index) => {
        const { transcript: currentTranscript } = recognitionResult[0];
        if (recognitionResult.isFinal) {
          finalTranscript += currentTranscript;
        } else if (options.interimResults) {
          interimTranscript += currentTranscript;
        }
        if (index === results.length - 1) {
          isFinal = recognitionResult.isFinal;
          alternativesForLastResult = Array.from(recognitionResult).map(
            (result) => result.transcript
          );
        }
      });
      setTranscript({ transcript: finalTranscript, interimTranscript });
      const transcriptForCallback = isFinal ? finalTranscript : interimTranscript;
      if (options.maxAlternatives !== undefined && options.maxAlternatives > 1) {
        onResultCallback?.(transcriptForCallback, isFinal, alternativesForLastResult ?? []);
        return;
      }
      onResultCallback?.(transcriptForCallback, isFinal);
    },
    [onResultCallback, options.interimResults, options.maxAlternatives]
  );
  const onError = useCallback(
    (event) => {
      setError(event);
      setListening(false);
      onErrorCallback?.(event);
      speechRecognitionRef.current = null;
    },
    [onErrorCallback]
  );
  const start = useCallback(() => {
    if (!supported || listening) return;
    const speechRecognitionInstance = new SpeechRecognition();
    speechRecognitionInstance.continuous = continuous;
    speechRecognitionInstance.grammars = grammars;
    speechRecognitionInstance.interimResults = interimResults;
    speechRecognitionInstance.lang = language;
    speechRecognitionInstance.maxAlternatives = maxAlternatives;
    speechRecognitionInstance.onstart = onStart;
    speechRecognitionInstance.onend = onEnd;
    speechRecognitionInstance.onerror = onError;
    speechRecognitionInstance.onresult = onResult;
    speechRecognitionRef.current = speechRecognitionInstance;
    speechRecognitionRef.current.start();
  }, [
    supported,
    listening,
    onResult,
    onEnd,
    onStart,
    onError,
    continuous,
    grammars,
    interimResults,
    language,
    maxAlternatives
  ]);
  const stop = useCallback(() => {
    if (!speechRecognitionRef.current) return;
    speechRecognitionRef.current.stop();
  }, []);
  const abort = useCallback(() => {
    if (!speechRecognitionRef.current) return;
    reset();
    setListening(false);
    onEndCallback?.();
    speechRecognitionRef.current.abort();
    speechRecognitionRef.current = null;
  }, [reset, onEndCallback]);
  // NOTE(@rupeq): do this on unmount only w/o defining the deps array
  useEffect(() => () => abort(), []);
  return { supported, listening, error, start, stop, abort, reset, ...transcript };
};
