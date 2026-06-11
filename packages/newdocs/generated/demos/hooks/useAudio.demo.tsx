'use client'

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

  const audio = useAudio('/new/sounds/pop-down.mp3', {
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
