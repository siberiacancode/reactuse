'use client'

import type { PointerEvent } from 'react';

import { useBoolean, useDoubleClick } from '@siberiacancode/reactuse';
import { HandIcon, RotateCcwIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import { cn } from '@/utils/lib';

const ZOOM_STEP = 1.25;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

type Tool = 'pan' | 'zoom-in' | 'zoom-out';

interface DragState {
  currentX: number;
  currentY: number;
  offsetX: number;
  offsetY: number;
  startX: number;
  startY: number;
}

const TOOLS = [
  { id: 'pan', label: 'Pan', icon: HandIcon },
  { id: 'zoom-in', label: 'Zoom in', icon: ZoomInIcon },
  { id: 'zoom-out', label: 'Zoom out', icon: ZoomOutIcon }
] as const;

const buildTransform = (x: number, y: number, scale: number) =>
  `translate(${x}px, ${y}px) scale(${scale})`;

const Demo = () => {
  const [tool, setTool] = useState<Tool>('zoom-in');
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useBoolean(false);
  const dragStateRef = useRef<DragState | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const applyZoom = (event: MouseEvent, direction: -1 | 1) => {
    const target = event.currentTarget as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    const cx = event.clientX - rect.left;
    const cy = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const imageX = (cx - centerX - offset.x) / zoom + centerX;
    const imageY = (cy - centerY - offset.y) / zoom + centerY;

    const nextZoom =
      direction === 1 ? Math.min(MAX_ZOOM, zoom * ZOOM_STEP) : Math.max(MIN_ZOOM, zoom / ZOOM_STEP);
    const nextOffsetX = cx - centerX - (imageX - centerX) * nextZoom;
    const nextOffsetY = cy - centerY - (imageY - centerY) * nextZoom;

    setZoom(nextZoom);
    setOffset(nextZoom === 1 ? { x: 0, y: 0 } : { x: nextOffsetX, y: nextOffsetY });
  };

  const imageRef = useDoubleClick<HTMLDivElement>((event) => {
    if (!(event instanceof MouseEvent)) return;
    if (tool === 'zoom-in') applyZoom(event, 1);
    if (tool === 'zoom-out') applyZoom(event, -1);
  });

  const onReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (tool !== 'pan') return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
      currentX: offset.x,
      currentY: offset.y
    };
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state || !imgRef.current) return;
    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;
    state.currentX = state.offsetX + dx;
    state.currentY = state.offsetY + dy;
    imgRef.current.style.transform = buildTransform(state.currentX, state.currentY, zoom);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setOffset({ x: state.currentX, y: state.currentY });
    dragStateRef.current = null;
    setDragging(false);
  };

  return (
    <section className='flex flex-col items-center gap-3 p-4'>
      <div className='border-border bg-card relative w-full max-w-md overflow-hidden rounded-xl border shadow-sm'>
        <div className='relative aspect-[4/3] overflow-hidden bg-neutral-900 select-none'>
          <div
            ref={imageRef}
            className={cn(
              'size-full',
              tool === 'pan' && (dragging ? 'cursor-grabbing' : 'cursor-grab'),
              tool === 'zoom-in' && 'cursor-zoom-in',
              tool === 'zoom-out' && 'cursor-zoom-out'
            )}
            onPointerCancel={onPointerUp}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <img
              ref={imgRef}
              className={cn(
                'size-full object-contain',
                dragging ? 'transition-none' : 'transition-transform duration-300 ease-out'
              )}
              style={{
                transform: buildTransform(offset.x, offset.y, zoom),
                transformOrigin: 'center',
                willChange: 'transform'
              }}
              alt='Mewtwo'
              draggable={false}
              src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png'
            />
          </div>

          <div className='pointer-events-none absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-white tabular-nums backdrop-blur-sm'>
            {zoom.toFixed(2)}x
          </div>

          <button
            aria-label='Reset'
            className='absolute top-2 right-2'
            data-size='icon'
            data-variant='secondary'
            type='button'
            onClick={onReset}
          >
            <RotateCcwIcon className='size-3.5' />
          </button>

          <div className='absolute top-1/2 right-2 flex -translate-y-1/2 flex-col gap-1'>
            {TOOLS.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  aria-label={item.label}
                  aria-pressed={tool === item.id}
                  data-size='icon'
                  data-variant={tool === item.id ? 'default' : 'secondary'}
                  type='button'
                  onClick={() => setTool(item.id)}
                >
                  <Icon className='size-3.5' />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p className='text-muted-foreground text-xs'>
        Pick a tool, then double-click or drag the image
      </p>
    </section>
  );
};

export default Demo;
