import { useCallback, useEffect, useRef, useState } from 'react';

/** An object containing event callbacks for speech recognition events */
interface SpeechRecognitionCallbacks {
  /** Callback invoked when speech recognition stops. */
  onEnd?: () => void;
  /** Callback invoked when an error occurs during recognition. */
  onError?: (error: SpeechRecognitionErrorEvent) => void;
  /** Callback invoked when recognition produces a result. When `options.interimResults` is true, this callback is called with interim results as the user speaks. When `options.maxAlternatives` is greater than 1, the third parameter contains an array of all alternative transcripts. */
  onResult?: (transcript: string, isFinal: boolean, alternatives?: string[]) => void;
  /** Callback invoked when speech recognition begins capturing audio. */
  onStart?: () => void;
}

/** Parameters for configuring the useSpeechRecognition hook. */
interface UseSpeechRecognitionOptions extends SpeechRecognitionCallbacks {
  /** If true, recognition continues even after pauses in speech. Default is false. */
  continuous?: SpeechRecognition['continuous'];
  /** A list of grammar rules. Default is an empty SpeechGrammarList (if available). */
  grammars?: SpeechRecognition['grammars'];
  /** If true, interim (non-final) results are provided as the user speaks. Default is false. */
  interimResults?: SpeechRecognition['interimResults'];
  /** The language in which recognition should occur. Must be a valid BCP 47 language tag (e.g., "en-US", "ru-RU"). Default is "en-US". */
  language?: SpeechRecognition['lang'];
  /** The maximum number of alternative transcripts returned for a given recognition result. Must be a positive integer. Default is 1. */
  maxAlternatives?: SpeechRecognition['maxAlternatives'];
}

/** Represents the transcript state maintained by the hook. */
interface Transcript {
  /** The latest interim transcript (if `interimResults` is true). */
  interimTranscript: string;
  /** The aggregated final transcript. */
  transcript: string;
}

/** The return type of the useSpeechRecognition hook. */
interface UseSpeechRecognitionReturn extends Transcript {
  /** The last error event encountered, or null if there is no error. */
  error: SpeechRecognitionErrorEvent | null;
  /** Whether the hook is currently listening for speech. */
  listening: boolean;
  /** Whether the current browser supports the Web Speech API. */
  supported: boolean;
  /** Immediately terminates recognition without processing remaining input. */
  abort: () => void;
  /** Resets/clears the current transcript and any errors. */
  reset: () => void;
  /** Begins speech recognition. */
  start: () => void;
  /** Ends speech recognition, finalizing results. */
  stop: () => void;
}

const getSpeechRecognitionAPI = () => {
  const SpeechRecognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
  const SpeechGrammarList = window.SpeechGrammarList ?? window.webkitSpeechGrammarList;
  const supported = Boolean(SpeechRecognition && SpeechGrammarList);

  return { SpeechRecognition, SpeechGrammarList, supported };
};

const DEFAULT_TRANSCRIPT: Readonly<Transcript> = {
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
export const useSpeechRecognition = (
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn => {
  const { supported, SpeechRecognition, SpeechGrammarList } = getSpeechRecognitionAPI();

  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);

  const [listening, setListening] = useState<boolean>(false);
  const [error, setError] = useState<SpeechRecognitionErrorEvent | null>(null);
  const [transcript, setTranscript] = useState<Transcript>(DEFAULT_TRANSCRIPT);

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
    (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';
      let isFinal = false;
      let alternativesForLastResult: string[] | null = null;

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
    (event: SpeechRecognitionErrorEvent) => {
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
    speechRecognitionInstance.grammars = grammars!;
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
