import type { MutableRefObject } from 'react';

import { useEffect, useRef, useState } from 'react';

export type UseSpeechSynthesisStatus = 'end' | 'init' | 'pause' | 'play';

export interface UseSpeechSynthesisParams {
  /** Language for SpeechSynthesis */
  lang?: string;
  /** Gets and sets the pitch at which the utterance will be spoken at.*/
  pitch?: SpeechSynthesisUtterance['pitch'];
  /** Gets and sets the speed at which the utterance will be spoken at. */
  rate?: SpeechSynthesisUtterance['rate'];
  /** Text to be spoken */
  text: string;
  /** Gets and sets the voice that will be used to speak the utterance. */
  voice?: SpeechSynthesisVoice | null;
  /** Gets and sets the volume that the utterance will be spoken at. */
  volume?: SpeechSynthesisUtterance['volume'];
}

/**
 * @name useSpeechSynthesis
 * @description - Hook that utilizes the speech synthesis api
 * @category Sensors
 *
 * @param {UseSpeechSynthesisParams} [options] The use speech synthesis options
 * @returns {UseSpeechSynthesisReturn} The speech synthesis return
 *
 * @example
 * const { supported, isPlaying, status, speak, stop } = useSpeechSynthesis();
 */
export const useSpeechSynthesis = (options: UseSpeechSynthesisParams) => {
  const { text, lang = 'en-US', pitch = 1, rate = 1, voice = null, volume = 1 } = options;

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<UseSpeechSynthesisStatus>('init');
  const [error, setError] = useState<SpeechSynthesisErrorEvent | undefined>();

  const utterance = useRef(isSupported ? new SpeechSynthesisUtterance(text) : null);

  useEffect(() => {
    if (!isSupported) return;

    utterance.current = new SpeechSynthesisUtterance(text);
    utterance.current.lang = lang;
    utterance.current.voice = voice;
    utterance.current.pitch = pitch;
    utterance.current.rate = rate;
    utterance.current.volume = volume;

    utterance.current.onstart = () => {
      setIsPlaying(true);
      setStatus('play');
    };

    utterance.current.onpause = () => {
      setIsPlaying(false);
      setStatus('pause');
    };

    utterance.current.onresume = () => {
      setIsPlaying(true);
      setStatus('play');
    };

    utterance.current.onend = () => {
      setIsPlaying(false);
      setStatus('end');
    };

    utterance.current.onerror = (event) => {
      setError(event);
    };
  }, [text]);

  useEffect(() => {
    if (utterance.current) {
      utterance.current.lang = lang;
    }
  }, [lang]);

  useEffect(() => {
    if (utterance.current) {
      utterance.current.voice = voice;
    }
  }, [voice]);

  useEffect(() => {
    if (utterance.current) {
      utterance.current.pitch = pitch;
    }
  }, [pitch]);

  useEffect(() => {
    if (utterance.current) {
      utterance.current.rate = rate;
    }
  }, [rate]);

  useEffect(() => {
    if (utterance.current) {
      utterance.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      setStatus('play');
      window.speechSynthesis.resume();
    } else {
      setStatus('pause');
      window.speechSynthesis.pause();
    }
  }, [isPlaying]);

  if (!isSupported) {
    return { isSupported };
  }

  const toggle = (value = !isPlaying) => {
    setIsPlaying(value);
  };

  const speak = () => {
    window.speechSynthesis.cancel();
    if (utterance) window.speechSynthesis.speak(utterance.current!);
  };

  const stop = () => {
    setStatus('end');
    window.speechSynthesis.cancel();
  };

  return {
    isSupported,
    isPlaying,
    status,
    utterance: utterance as MutableRefObject<SpeechSynthesisUtterance>,
    error,
    stop,
    toggle,
    speak
  };
};

export type UseSpeechSynthesisReturn = ReturnType<typeof useSpeechSynthesis>;
