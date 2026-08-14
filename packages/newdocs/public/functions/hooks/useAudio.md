---
title: useAudio
description: Hook that manages audio playback with sprite support
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1762758339000
---

# useAudio

Hook that manages audio playback with sprite support

## Demo

```tsx
import { useAudio } from '@siberiacancode/reactuse';
import { CircleIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

const WIN_PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

type Cell = 'O' | 'X' | null;
interface GameResult {
  line: number[] | null;
  winner: 'draw' | 'O' | 'X';
}

const checkWinner = (board: Cell[]) => {
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as 'O' | 'X', line: pattern };
    }
  }
  if (board.every(Boolean)) return { winner: 'draw' as const, line: null };
  return null;
};

const CELL_SIZE = 60;
const BOARD_SIZE = CELL_SIZE * 3;
const MARK_PADDING = 16;

const getCellX = (index: number) => (index % 3) * CELL_SIZE + CELL_SIZE / 2;
const getCellY = (index: number) => Math.floor(index / 3) * CELL_SIZE + CELL_SIZE / 2;

const PlayerIcon = ({ player }: { player: 'O' | 'X' }) => {
  const Icon = player === 'X' ? XIcon : CircleIcon;
  return <Icon className={player === 'O' ? 'text-primary size-4' : 'size-4'} />;
};

const Demo = () => {
  const [board, setBoard] = useState<Cell[]>(Array.from({ length: 9 }).fill(null) as Cell[]);
  const [current, setCurrent] = useState<'O' | 'X'>('X');
  const [result, setResult] = useState<GameResult | null>(null);

  const audio = useAudio('/sounds/pop-down.mp3', {
    interrupt: true,
    volume: 0.6
  });

  const onCellClick = (index: number) => {
    if (board[index] || result) return;

    const newBoard = [...board];
    newBoard[index] = current;
    setBoard(newBoard);
    audio.play();

    const gameResult = checkWinner(newBoard);
    if (gameResult) setResult(gameResult);
    else setCurrent(current === 'X' ? 'O' : 'X');
  };

  const reset = () => {
    setBoard(Array.from({ length: 9 }).fill(null) as Cell[]);
    setCurrent('X');
    setResult(null);
    audio.stop();
  };

  const getWinLine = (line: number[]) => {
    const [start, , end] = line;
    const startX = getCellX(start);
    const startY = getCellY(start);
    const endX = getCellX(end);
    const endY = getCellY(end);
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const extend = 14 / length;

    return {
      x1: startX - deltaX * extend,
      y1: startY - deltaY * extend,
      x2: endX + deltaX * extend,
      y2: endY + deltaY * extend
    };
  };

  const winCoords = result?.line ? getWinLine(result.line) : null;

  return (
    <section className='flex flex-col items-center gap-5 p-4'>
      <svg className='w-64' viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`}>
        {[CELL_SIZE, CELL_SIZE * 2].map((position) => (
          <g key={position} className='text-muted-foreground'>
            <line
              stroke='currentColor'
              strokeLinecap='round'
              strokeWidth='3'
              x1={position}
              x2={position}
              y1='6'
              y2={BOARD_SIZE - 6}
            />
            <line
              stroke='currentColor'
              strokeLinecap='round'
              strokeWidth='3'
              x1='6'
              x2={BOARD_SIZE - 6}
              y1={position}
              y2={position}
            />
          </g>
        ))}

        {board.map(
          (cell, index) =>
            cell === 'X' && (
              <g key={`x-${index}`} className='text-[var(--brand-hex)]'>
                <line
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeWidth='5'
                  x1={getCellX(index) - MARK_PADDING}
                  x2={getCellX(index) + MARK_PADDING}
                  y1={getCellY(index) - MARK_PADDING}
                  y2={getCellY(index) + MARK_PADDING}
                />
                <line
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeWidth='5'
                  x1={getCellX(index) + MARK_PADDING}
                  x2={getCellX(index) - MARK_PADDING}
                  y1={getCellY(index) - MARK_PADDING}
                  y2={getCellY(index) + MARK_PADDING}
                />
              </g>
            )
        )}

        {board.map(
          (cell, index) =>
            cell === 'O' && (
              <circle
                key={`o-${index}`}
                className='text-primary'
                cx={getCellX(index)}
                cy={getCellY(index)}
                fill='none'
                r={MARK_PADDING}
                stroke='currentColor'
                strokeLinecap='round'
                strokeWidth='5'
              />
            )
        )}

        {winCoords && result?.winner !== 'draw' && (
          <line
            className='text-primary'
            stroke='currentColor'
            strokeLinecap='round'
            strokeWidth='6'
            x1={winCoords.x1}
            x2={winCoords.x2}
            y1={winCoords.y1}
            y2={winCoords.y2}
          />
        )}

        {board.map((_, index) => (
          <rect
            key={`cell-${index}`}
            className={!board[index] && !result ? 'cursor-pointer' : 'cursor-default'}
            fill='transparent'
            height={CELL_SIZE}
            width={CELL_SIZE}
            x={(index % 3) * CELL_SIZE}
            y={Math.floor(index / 3) * CELL_SIZE}
            onClick={() => onCellClick(index)}
          />
        ))}
      </svg>

      <div className='flex min-h-9 items-center gap-3 text-sm'>
        {!result && (
          <p className='text-muted-foreground flex items-center gap-1.5'>
            <PlayerIcon player={current} /> to move
          </p>
        )}
        {result && result.winner === 'draw' && (
          <p className='text-muted-foreground'>It&apos;s a draw</p>
        )}
        {result && result.winner !== 'draw' && (
          <p className='text-muted-foreground flex items-center gap-1.5'>
            <PlayerIcon player={result.winner} /> wins
          </p>
        )}
        {result && (
          <button data-variant='link' type='button' onClick={reset}>
            play again
          </button>
        )}
      </div>
    </section>
  );
};

export default Demo;
```

## Installation

### Library

```bash
npm install @siberiacancode/reactuse
```

### CLI

```bash
npx useverse@latest add useAudio
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

/** Type sprite map */
export interface SpriteMap {
  /** [start time in seconds, end time in seconds] */
  [key: string]: [number, number];
}

/** Type use audio options */
export interface UseAudioOptions {
  /** Whether audio playback is initially enabled */
  immediately?: boolean;
  /** Whether to stop current playback when starting a new one */
  interrupt?: boolean;
  /** Initial playback speed (0.5 to 2) */
  playbackRate?: number;
  /** Map of named audio segments for sprite-based playback */
  sprite?: SpriteMap;
  /** Initial volume level (0 to 1) */
  volume?: number;
}

/** Type use audio return type */
export interface UseAudioReturn {
  /** Current playback speed (0.5 to 2) */
  playbackRate: number;
  /** Whether audio is currently playing */
  playing: boolean;
  /** Current volume level (0 to 1) */
  volume: number;
  /** Set playback speed (0.5 to 2) */
  changePlaybackRate: (value: number) => void;
  /** Pause audio playback at current position */
  pause: () => void;
  /** Start audio playback from the beginning or specified sprite segment */
  play: (sprite?: string) => Promise<void>;
  /** Set audio volume level (0 to 1) */
  setVolume: (value: number) => void;
  /** Stop audio playback and reset position to start */
  stop: () => void;
}

/**
 * @name useAudio
 * @description - Hook that manages audio playback with sprite support
 * @category Browser
 * @usage low

 * @browserapi Audio https://developer.mozilla.org/en-US/docs/Web/API/Audio
 *
 * @template Value The type of the value
 * @param {string} url The URL of the audio file to play
 * @param {UseAudioOptions} [options] Audio configuration options
 * @param {number} [options.volume=1] Initial volume level (0 to 1)
 * @param {number} [options.playbackRate=1] Initial playback speed (0.5 to 2)
 * @param {boolean} [options.interrupt=false] Whether to stop current playback when starting a new one
 * @param {boolean} [options.soundEnabled=true] Whether audio playback is initially enabled
 * @param {SpriteMap} [options.sprite] Map of named audio segments for sprite-based playback
 * @returns {UseAudioReturn} An object containing audio controls and state
 *
 * @example
 * const audio = useAudio("/path/to/sound.mp3");
 */
export const useAudio = (src: string, options: UseAudioOptions = {}): UseAudioReturn => {
  const [playing, setPlaying] = useState(false);
  const [volume, setCurrentVolume] = useState(options.volume ?? 1);
  const [playbackRate, setPlaybackRate] = useState(options.playbackRate ?? 1);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);

    audio.volume = volume;
    audio.playbackRate = playbackRate;
    audioRef.current = audio;

    if (options.immediately) {
      try {
        setPlaying(true);
        audio.play();
      } catch {
        setPlaying(false);
      }
    }

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onVolumeChange = () => setCurrentVolume(audio.volume);
    const onRateChange = () => setPlaybackRate(audio.playbackRate);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('volumechange', onVolumeChange);
    audio.addEventListener('ratechange', onRateChange);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('volumechange', onVolumeChange);
      audio.removeEventListener('ratechange', onRateChange);

      audio.pause();
      audio.remove();
    };
  }, [src]);

  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaying(false);
  };

  const play = async (spriteName?: string) => {
    if (!audioRef.current) return;
    if (options.interrupt) stop();

    setPlaying(true);

    if (!spriteName || !options.sprite?.[spriteName]) {
      await audioRef.current.play();
      return;
    }

    const [start, end] = options.sprite[spriteName];
    audioRef.current.currentTime = start;
    await audioRef.current.play();

    const checkTime = () => {
      if (!audioRef.current) return;
      if (audioRef.current.currentTime >= end) {
        stop();
      }

      if (!playing) return;

      requestAnimationFrame(checkTime);
    };

    requestAnimationFrame(checkTime);
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setPlaying(false);
  };

  const setVolume = (value: number) => {
    if (!audioRef.current) return;
    const newVolume = Math.max(0, Math.min(1, value));
    audioRef.current.volume = newVolume;
    setCurrentVolume(newVolume);
  };

  const changePlaybackRate = (value: number) => {
    if (!audioRef.current) return;
    const newRate = Math.max(0.5, Math.min(2, value));
    audioRef.current.playbackRate = newRate;
    setPlaybackRate(newRate);
  };

  return {
    play,
    pause,
    stop,
    playing,
    setVolume,
    volume,
    changePlaybackRate,
    playbackRate
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const audio = useAudio("/path/to/sound.mp3");
```

## Type Declarations

```tsx
export interface SpriteMap {
  /** [start time in seconds, end time in seconds] */
  [key: string]: [number, number];
}

export interface UseAudioOptions {
  /** Whether audio playback is initially enabled */
  immediately?: boolean;
  /** Whether to stop current playback when starting a new one */
  interrupt?: boolean;
  /** Initial playback speed (0.5 to 2) */
  playbackRate?: number;
  /** Map of named audio segments for sprite-based playback */
  sprite?: SpriteMap;
  /** Initial volume level (0 to 1) */
  volume?: number;
}

export interface UseAudioReturn {
  /** Current playback speed (0.5 to 2) */
  playbackRate: number;
  /** Whether audio is currently playing */
  playing: boolean;
  /** Current volume level (0 to 1) */
  volume: number;
  /** Set playback speed (0.5 to 2) */
  changePlaybackRate: (value: number) => void;
  /** Pause audio playback at current position */
  pause: () => void;
  /** Start audio playback from the beginning or specified sprite segment */
  play: (sprite?: string) => Promise<void>;
  /** Set audio volume level (0 to 1) */
  setVolume: (value: number) => void;
  /** Stop audio playback and reset position to start */
  stop: () => void;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| url | `string` | - | The URL of the audio file to play |
| options | `UseAudioOptions` | - | Audio configuration options |
| options.volume | `number` | 1 | Initial volume level (0 to 1) |
| options.playbackRate | `number` | 1 | Initial playback speed (0.5 to 2) |
| options.interrupt | `boolean` | false | Whether to stop current playback when starting a new one |
| options.soundEnabled | `boolean` | true | Whether audio playback is initially enabled |
| options.sprite | `SpriteMap` | - | Map of named audio segments for sprite-based playback |

### Returns

`UseAudioReturn` - An object containing audio controls and state