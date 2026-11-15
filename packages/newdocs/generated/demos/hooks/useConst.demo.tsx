'use client';

import { useConst } from '@siberiacancode/reactuse';
import { HeartIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const PALETTES = [
  ['#0f172a', '#1e293b', '#475569', '#94a3b8', '#cbd5e1'],
  ['#7c2d12', '#c2410c', '#f97316', '#fdba74', '#fff7ed'],
  ['#064e3b', '#047857', '#10b981', '#6ee7b7', '#ecfdf5'],
  ['#1e1b4b', '#4338ca', '#818cf8', '#c7d2fe', '#eef2ff'],
  ['#831843', '#be185d', '#ec4899', '#f9a8d4', '#fdf2f8']
];

const GRID_COLS = 35;
const GRID_ROWS = 20;

const random = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const generatePost = () => {
  const palette = random(PALETTES);
  const pixels = Array.from({ length: GRID_COLS * GRID_ROWS }).map(() => random(palette));

  return {
    pixels,
    palette,
    author: 'reactuse'
  };
};

const Demo = () => {
  const post = useConst(generatePost);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(() => Math.floor(Math.random() * 60) + 20);

  const onToggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <section className='flex w-full max-w-md flex-col gap-3 p-4'>
      <span className='text-muted-foreground text-sm'>@{post.author}</span>

      <div
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
          aspectRatio: `${GRID_COLS} / ${GRID_ROWS}`
        }}
        className='grid w-full'
      >
        {post.pixels.map((color, index) => (
          <div key={index} className='rounded-xl' style={{ backgroundColor: color }} />
        ))}
      </div>

      <button
        className={cn(
          'flex w-fit items-center gap-1.5 px-0! text-sm transition-colors',
          liked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
        )}
        data-variant='unstyled'
        type='button'
        onClick={onToggleLike}
      >
        <HeartIcon className='size-4' fill={liked ? 'currentColor' : 'none'} />
        {likeCount}
      </button>
    </section>
  );
};

export default Demo;
