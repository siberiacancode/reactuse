import { useEffect, useState } from 'react';

/** The use speech recognition hook options type */
interface UseSpeechRecognitionOptions {
  /** If true, recognition continues even after pauses in speech. Default is false */
  continuous?: SpeechRecognition['continuous'];
  /** A list of grammar rules */
  grammars?: SpeechRecognition['grammars'];
  /** If true, interim (non-final) results are provided as the user speaks */
  interimResults?: SpeechRecognition['interimResults'];
  /** The language in which recognition should occur. Must be a valid BCP 47 language tag (e.g., "en-US", "ru-RU") */
  language?: SpeechRecognition['lang'];
  /** The maximum number of alternative transcripts returned for a given recognition result. Must be a positive integer */
  maxAlternatives?: SpeechRecognition['maxAlternatives'];
  /** Callback invoked when speech recognition ends */
  onEnd?: () => void;
  /** Callback invoked when an error occurs during recognition */
  onError?: (error: SpeechRecognitionErrorEvent) => void;
  /** Callback invoked when recognition produces a result */
  onResult?: (event: SpeechRecognitionEvent) => void;
  /** Callback invoked when speech recognition starts */
  onStart?: () => void;
}

/** The return type of the useSpeechRecognition hook. */
interface UseSpeechRecognitionReturn {
  /** The error state */
  error: SpeechRecognitionErrorEvent | null;
  /** The final transcript */
  final: boolean;
  /** Whether the hook is currently listening for speech */
  listening: boolean;
  /** The speech recognition instance */
  recognition: SpeechRecognition;
  /** Whether the current browser supports the Web Speech API */
  supported: boolean;
  /** The current transcript */
  transcript: string;
  /** Begins speech recognition */
  start: () => void;
  /** Ends speech recognition, finalizing results */
  stop: () => void;
  /** Toggles the listening state */
  toggle: (value?: boolean) => void;
}

export const getSpeechRecognition = () =>
  window?.SpeechRecognition ?? window?.webkitSpeechRecognition;

/**
 * @name useSpeechRecognition
 * @description - Hook that provides a streamlined interface for incorporating speech-to-text functionality
 * @category Browser
 *
 * @browserapi window.SpeechRecognition https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
 *
 * @param {boolean} [options.continuous=false] Whether recognition should continue after pauses
 * @param {boolean} [options.interimResults=false] Whether interim results should be provided
 * @param {string} [options.language="en-US"] The language for recognition, as a valid BCP 47 tag
 * @param {number} [options.maxAlternatives=1] The maximum number of alternative transcripts to return
 * @param {SpeechGrammarList} [options.grammars] A list of grammar rules
 * @param {() => void} [options.onStart] Callback invoked when speech recognition starts
 * @param {() => void} [options.onEnd] Callback invoked when speech recognition ends
 * @param {(error: SpeechRecognitionErrorEvent) => void} [options.onError] Callback invoked when an error occurs during recognition
 * @param {(event: SpeechRecognitionEvent) => void} [options.onResult] Callback invoked when recognition produces a result
 * @returns {UseSpeechRecognitionReturn} An object containing the speech recognition functionality
 *
 * @example
 * const { supported, value, recognition, listening, error, start, stop, toggle  } = useSpeechRecognition();
 */
export const useSpeechRecognition = (
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn => {
  const supported = typeof window !== 'undefined' && !!getSpeechRecognition();

  const {
    continuous = false,
    interimResults = false,
    language = 'en-US',
    grammars,
    maxAlternatives = 1,
    onStart,
    onEnd,
    onError,
    onResult
  } = options;

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [final, setFinal] = useState(false);
  const [error, setError] = useState<SpeechRecognitionErrorEvent | null>(null);
  const [recognition] = useState<SpeechRecognition>(() => {
    if (!supported) return {} as SpeechRecognition;

    const SpeechRecognition = getSpeechRecognition();
    const speechRecognition = new SpeechRecognition();

    speechRecognition.continuous = continuous;
    if (grammars) speechRecognition.grammars = grammars;
    speechRecognition.interimResults = interimResults;
    speechRecognition.lang = language;
    speechRecognition.maxAlternatives = maxAlternatives;

    speechRecognition.onstart = () => {
      setListening(true);
      setFinal(false);
      onStart?.();
    };
    speechRecognition.onend = () => {
      setListening(false);
      onEnd?.();
    };
    speechRecognition.onerror = (event) => {
      setError(event);
      setListening(false);
      onError?.(event);
    };
    speechRecognition.onresult = (event) => {
      console.log('onresult', event);
      const currentResult = event.results[event.resultIndex];
      const { transcript } = currentResult[0];

      setTranscript(transcript);
      setError(null);
      onResult?.(event);
    };
    speechRecognition.onend = () => {
      setListening(false);
      speechRecognition.lang = language;
    };

    return speechRecognition;
  });

  useEffect(() => () => recognition.stop(), []);

  const start = () => recognition.start();
  const stop = () => recognition.stop();

  const toggle = (value = !listening) => {
    if (value) return start();
    stop();
  };

  return {
    supported,
    transcript,
    recognition,
    final,
    listening,
    error,
    start,
    stop,
    toggle
  };
};
