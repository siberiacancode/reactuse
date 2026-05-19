'use client'

import { useAudio } from '@siberiacancode/reactuse';
import { useState } from 'react';

const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const checkWinner = (board: (string | null)[]) => {
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return { winner: board[a] as 'X' | 'O', line: pattern };
  }
  if (board.every(Boolean)) return { winner: 'draw' as const, line: null };
  return null;
};

const S = 50;
const SIZE = S * 3;
const P = 14;
const cx = (i: number) => (i % 3) * S + S / 2;
const cy = (i: number) => Math.floor(i / 3) * S + S / 2;

const PLAYERS = [
  { id: 'X' as const, color: '#3b82f6', label: 'Player X' },
  { id: 'O' as const, color: '#e11d48', label: 'Player O' },
];

const Demo = () => {
  const [board, setBoard] = useState<(null | 'X' | 'O')[]>(Array(9).fill(null));
  const [current, setCurrent] = useState<'X' | 'O'>('X');
  const [result, setResult] = useState<{ winner: 'X' | 'O' | 'draw'; line: number[] | null } | null>(null);

  const audio = useAudio('/sounds/pop-down.mp3', { volume: 0.6 });

  const onCellClick = (i: number) => {
    if (board[i] || result) return;
    const newBoard = [...board];
    newBoard[i] = current;
    setBoard(newBoard);
    audio.play();
    const gameResult = checkWinner(newBoard);
    if (gameResult) setResult(gameResult);
    else setCurrent(current === 'X' ? 'O' : 'X');
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setCurrent('X');
    setResult(null);
  };

  const getWinLine = (line: number[]) => {
    const [a, , c] = line;
    const ax = cx(a), ay = cy(a), bx = cx(c), by = cy(c);
    const dx = bx - ax, dy = by - ay;
    const len = Math.sqrt(dx * dx + dy * dy);
    const m = 12 / len;
    return { x1: ax - dx * m, y1: ay - dy * m, x2: bx + dx * m, y2: by + dy * m };
  };

  const winCoords = result?.line ? getWinLine(result.line) : null;
  const winner = result?.winner !== 'draw' ? PLAYERS.find(p => p.id === result?.winner) : null;
  const currentPlayer = PLAYERS.find(p => p.id === current)!;

  return (
    <>
      <style>{`
        @keyframes draw-win {
          from { stroke-dashoffset: 400; }
          to   { stroke-dashoffset: 0; }
        }
        .win-line { stroke-dasharray: 400; animation: draw-win 0.4s ease-out forwards; }
      `}</style>

      <section className='relative flex w-full max-w-[200px] flex-col items-center gap-3'>
        <div className='flex items-center gap-1.5 self-start'>
          <span className='relative flex h-1.5 w-1.5' style={{ color: currentPlayer.color }}>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-70' />
            <span className='relative inline-flex h-1.5 w-1.5 rounded-full bg-current' />
          </span>
          <span className='text-muted-foreground text-xs'>
            Player <span className='text-foreground font-medium'>{current}</span>'s turn
          </span>
        </div>

        <div className='w-full'>
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width='100%'>
            {[S, S * 2].map((v) => (
              <g key={v}>
                <line stroke='currentColor' strokeLinecap='round' strokeWidth='4' x1={v} x2={v} y1='4' y2={SIZE - 4} />
                <line stroke='currentColor' strokeLinecap='round' strokeWidth='4' x1='4' x2={SIZE - 4} y1={v} y2={v} />
              </g>
            ))}

            {board.map((cell, i) => cell !== 'X' ? null : (
              <g key={`x-${i}`}>
                <line stroke='#3b82f6' strokeLinecap='round' strokeWidth='6' x1={cx(i) - P} x2={cx(i) + P} y1={cy(i) - P} y2={cy(i) + P} />
                <line stroke='#3b82f6' strokeLinecap='round' strokeWidth='6' x1={cx(i) + P} x2={cx(i) - P} y1={cy(i) - P} y2={cy(i) + P} />
              </g>
            ))}

            {board.map((cell, i) => cell !== 'O' ? null : (
              <circle key={`o-${i}`} cx={cx(i)} cy={cy(i)} fill='none' r={P} stroke='#e11d48' strokeLinecap='round' strokeWidth='6' />
            ))}

            {winCoords && result?.winner !== 'draw' && (
              <line
                className='win-line'
                stroke='white'
                strokeLinecap='round'
                strokeWidth='6'
                x1={winCoords.x1}
                x2={winCoords.x2}
                y1={winCoords.y1}
                y2={winCoords.y2}
              />
            )}

            {board.map((_, i) => (
              <rect
                key={`cell-${i}`}
                className={!board[i] && !result ? 'cursor-pointer' : 'cursor-default'}
                fill='transparent'
                height={S}
                width={S}
                x={(i % 3) * S}
                y={Math.floor(i / 3) * S}
                onClick={() => onCellClick(i)}
              />
            ))}
          </svg>
        </div>

        <div className='flex w-full gap-2'>
          {PLAYERS.map(({ id, color, label }) => {
            const isActive = current === id;
            return (
              <div
                key={id}
                className='flex flex-1 items-center gap-1.5 rounded-xl border px-2 py-1.5 transition-all duration-300'
                style={{
                  borderColor: isActive ? color : 'transparent',
                  backgroundColor: isActive ? `${color}0f` : undefined,
                  opacity: isActive ? 1 : 0.4,
                }}
              >
                <svg fill='none' height={12} strokeLinecap='round' viewBox='0 0 24 24' width={12}>
                  {id === 'X' ? (
                    <>
                      <line stroke={color} strokeWidth='2.5' x1='5' x2='19' y1='5' y2='19' />
                      <line stroke={color} strokeWidth='2.5' x1='19' x2='5' y1='5' y2='19' />
                    </>
                  ) : (
                    <circle cx='12' cy='12' r='8' stroke={color} strokeWidth='2.5' />
                  )}
                </svg>
                <span className='text-xs font-medium truncate'>{label}</span>
              </div>
            );
          })}
        </div>

        {result && (
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-background/85 backdrop-blur-md'>
            {winner ? (
              <>
                <svg fill='none' height={36} strokeLinecap='round' viewBox='0 0 24 24' width={36}>
                  {winner.id === 'X' ? (
                    <>
                      <line stroke={winner.color} strokeWidth='2' x1='5' x2='19' y1='5' y2='19' />
                      <line stroke={winner.color} strokeWidth='2' x1='19' x2='5' y1='5' y2='19' />
                    </>
                  ) : (
                    <circle cx='12' cy='12' r='8' stroke={winner.color} strokeWidth='2' />
                  )}
                </svg>
                <p className='text-center text-base font-bold leading-snug'>
                  <span style={{ color: winner.color }}>{winner.label}</span>{' wins!'}
                </p>
              </>
            ) : (
              <p className='text-center text-base font-bold leading-snug'>
                Draw!<br />
                <span className='text-muted-foreground text-xs font-normal'>No winner this round</span>
              </p>
            )}
            <button data-variant='outline' type='button' onClick={reset}>
              New game
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default Demo;
