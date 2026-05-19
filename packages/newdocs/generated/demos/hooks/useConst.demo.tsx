'use client'

import { useConst } from '@siberiacancode/reactuse';
import { HeartIcon } from 'lucide-react';
import { useState } from 'react';

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

const formatPostedAt = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

const generatePost = () => {
  const palette = random(PALETTES);
  const pixels = Array.from({ length: GRID_COLS * GRID_ROWS }).map(() => random(palette));

  return {
    pixels,
    palette,
    author: 'siberiacancode',
    postedAt: formatPostedAt(new Date())
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
    <section className='flex min-w-xs flex-col items-center rounded-2xl border p-4 md:min-w-md'>
      <div className='flex w-full flex-col gap-4 overflow-hidden'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium'>@{post.author}</span>
        </div>

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

        <div className='flex items-center justify-between gap-4 py-2'>
          <button data-variant='ghost' type='button' onClick={onToggleLike}>
            <HeartIcon
              className='pointer-events-none size-4'
              fill={liked ? '#ef4444' : 'none'}
              stroke={liked ? '#ef4444' : 'currentColor'}
            />
            <span>{likeCount} likes</span>
          </button>

          <div className='text-muted-foreground text-xs'>{post.postedAt}</div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
