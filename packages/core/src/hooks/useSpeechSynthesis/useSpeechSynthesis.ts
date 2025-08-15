import { useEffect, useRef, useState } from 'react';

/** The use speech synthesis status type */
export type UseSpeechSynthesisStatus = 'end' | 'init' | 'pause' | 'play';

/** The use speech synthesis options type */
export interface UseSpeechSynthesisOptions {
  /** Language for SpeechSynthesis */
  lang?: string;
  /** Gets and sets the pitch at which the utterance will be spoken at. */
  pitch?: number;
  /** Gets and sets the speed at which the utterance will be spoken at. */
  rate?: number;
  /** The text to be spoken */
  text?: string;
  /** Gets and sets the voice that will be used to speak the utterance. */
  voice?: SpeechSynthesisVoice | null;
  /** Gets and sets the volume that the utterance will be spoken at. */
  volume?: number;
}

/** The use speech synthesis return type */
export interface UseSpeechSynthesisReturn {
  /** Any error that occurred during speech synthesis. */
  error: SpeechSynthesisErrorEvent | undefined;
  /** Indicates if speech is currently playing. */
  playing: boolean;
  /** The current status of speech synthesis. */
  status: UseSpeechSynthesisStatus;
  /** Indicates if the SpeechSynthesis API is supported in the current environment. */
  supported: boolean;
  /** The SpeechSynthesisUtterance instance. */
  utterance: SpeechSynthesisUtterance | null;
  /** Function to pause speech synthesis. */
  pause: () => void;
  /** Function to resume speech synthesis. */
  resume: () => void;
  /** Function to start speech synthesis. */
  speak: () => void;
  /** Function to stop speech synthesis. */
  stop: () => void;
  /** Function to toggle between play and pause. */
  toggle: (value?: boolean) => void;
}

/**
 * @name useSpeechSynthesis
 * @description - Hook that provides speech synthesis functionality
 * @category Browser
 * @usage low
 *
 * @browserapi SpeechSynthesis https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
 *
 * @params {string} [options.text] - The text to be spoken
 * @params {string} [options.lang] - The language to be spoken
 * @params {number} [options.pitch] - The pitch to be spoken
 * @params {number} [options.rate] - The rate to be spoken
 * @params {SpeechSynthesisVoice} [options.voice] - The voice to be spoken
 * @params {number} [options.volume] - The volume to be spoken
 * @returns {UseSpeechSynthesisReturn} An object containing the speech synthesis state and control methods
 *
 * @example
 * const { supported, playing, status, utterance, error, stop, toggle, speak, resume, pause } = useSpeechSynthesis();
 */
export const useSpeechSynthesis = (
  options: UseSpeechSynthesisOptions = {}
): UseSpeechSynthesisReturn => {
  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window && !!window.speechSynthesis;

  const { text = '', lang = 'en-US', pitch = 1, rate = 1, voice = null, volume = 1 } = options;

  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState<UseSpeechSynthesisStatus>('init');
  const [error, setError] = useState<SpeechSynthesisErrorEvent>();
  const speechSynthesisUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const bindSpeechSynthesisUtterance = (speechSynthesisUtterance: SpeechSynthesisUtterance) => {
    speechSynthesisUtterance.lang = lang;
    speechSynthesisUtterance.pitch = pitch;
    speechSynthesisUtterance.rate = rate;
    speechSynthesisUtterance.volume = volume;
    speechSynthesisUtterance.voice = voice;

    speechSynthesisUtterance.onstart = () => {
      setPlaying(true);
      setStatus('play');
    };

    speechSynthesisUtterance.onpause = () => {
      setPlaying(false);
      setStatus('pause');
    };

    speechSynthesisUtterance.onresume = () => {
      setPlaying(true);
      setStatus('play');
    };

    speechSynthesisUtterance.onend = () => {
      setPlaying(false);
      setStatus('end');
    };

    speechSynthesisUtterance.onerror = (event) => {
      setPlaying(false);
      setError(event);
    };
  };

  useEffect(() => {
    if (!supported) return;

    const speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
    bindSpeechSynthesisUtterance(speechSynthesisUtterance);
    speechSynthesisUtteranceRef.current = speechSynthesisUtterance;

    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [text, lang, pitch, rate, voice, volume]);

  const speak = (text?: string) => {
    if (!supported) return;

    if (text) {
      speechSynthesisUtteranceRef.current = new SpeechSynthesisUtterance(text);
      bindSpeechSynthesisUtterance(speechSynthesisUtteranceRef.current);
    }

    window.speechSynthesis?.cancel();
    if (speechSynthesisUtteranceRef.current)
      window.speechSynthesis?.speak(speechSynthesisUtteranceRef.current);
  };

  const stop = () => {
    if (!supported) return;

    window.speechSynthesis?.cancel();
    setPlaying(false);
  };

  const toggle = (value = !playing) => {
    if (!supported) return;

    if (value) {
      window.speechSynthesis?.resume();
    } else {
      window.speechSynthesis?.pause();
    }
    setPlaying(value);
  };

  const resume = () => {
    setPlaying(true);
    window.speechSynthesis?.resume();
  };

  const pause = () => {
    setPlaying(false);
    window.speechSynthesis?.pause();
  };

  return {
    supported,
    playing,
    status,
    utterance: speechSynthesisUtteranceRef.current,
    error,

    stop,
    toggle,
    speak,
    resume,
    pause
  };
};
