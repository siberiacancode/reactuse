import { useResizeObserver } from '@siberiacancode/reactuse';
import { GripVerticalIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import { cn } from '@/utils/lib';

interface Chat {
  id: string;
  initials: string;
  message: string;
  name: string;
  online?: boolean;
  time: string;
  unread?: number;
}

const CHATS: Chat[] = [
  {
    id: '1',
    name: 'Design Team',
    message: 'Daria: pushed the new icons 🎨',
    time: '23:05',
    initials: 'DT',
    unread: 3,
    online: true
  },
  {
    id: '2',
    name: 'Dmitry Babin',
    message: 'See you at the meeting tomorrow',
    time: '12:03',
    initials: 'AC',
    online: true
  },
  {
    id: '3',
    name: 'reactuse',
    message: 'You: just shipped useResizeObserver',
    time: '11:48',
    initials: 'RU',
    unread: 1
  }
];

const COLLAPSED_WIDTH = 66;
const EXPANDED_MIN = 240;
const EXPANDED_MAX = 420;
const SNAP_POINT = (COLLAPSED_WIDTH + EXPANDED_MIN) / 2;

const getEntryWidth = (entry: ResizeObserverEntry) =>
  entry.borderBoxSize[0]?.inlineSize ?? entry.contentRect.width;

const Demo = () => {
  const [width, setWidth] = useState(340);
  const [expanded, setExpanded] = useState(true);
  const draggingRef = useRef(false);
  const dragRef = useRef({ startWidth: 340, startX: 0 });

  const resizeObserver = useResizeObserver<HTMLDivElement>({
    box: 'border-box',
    onChange: ([entry]) => setExpanded(getEntryWidth(entry) >= EXPANDED_MIN)
  });

  const onPointerDown = (event: React.PointerEvent) => {
    draggingRef.current = true;
    dragRef.current = {
      startWidth: width,
      startX: event.clientX
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!draggingRef.current) return;

    const rawWidth = Math.min(
      EXPANDED_MAX,
      Math.max(COLLAPSED_WIDTH, dragRef.current.startWidth + event.clientX - dragRef.current.startX)
    );

    setWidth(rawWidth < SNAP_POINT ? COLLAPSED_WIDTH : Math.max(EXPANDED_MIN, rawWidth));
  };

  const onPointerUp = (event: React.PointerEvent) => {
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <section className='flex flex-col items-center gap-3 p-4'>
      <div className='relative'>
        <div
          ref={resizeObserver.ref}
          className='border-border bg-card no-scrollbar flex flex-col overflow-hidden rounded-2xl border'
          style={{ width }}
        >
          {CHATS.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                'hover:bg-muted/50 flex cursor-pointer items-center gap-3 py-2.5 transition-colors',
                expanded ? 'px-3' : 'justify-center px-0'
              )}
            >
              <div className='relative shrink-0'>
                <div data-size='lg' data-slot='avatar'>
                  <span data-slot='avatar-fallback'>{chat.initials}</span>
                </div>
                {chat.online && (
                  <span className='ring-card absolute right-0 bottom-0 size-3 rounded-full bg-green-500 ring-2' />
                )}
                {!expanded && !!chat.unread && (
                  <span className='bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] font-semibold'>
                    {chat.unread}
                  </span>
                )}
              </div>

              {expanded && (
                <div className='flex min-w-0 flex-1 flex-col'>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='text-foreground truncate text-sm font-medium'>
                      {chat.name}
                    </span>
                    <span className='text-muted-foreground shrink-0 text-xs'>{chat.time}</span>
                  </div>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='text-muted-foreground truncate text-xs'>{chat.message}</span>
                    {!!chat.unread && (
                      <span className='bg-primary text-primary-foreground flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold'>
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          aria-label='Resize'
          className='border-border bg-card text-muted-foreground hover:text-foreground absolute top-1/2 -right-3 z-10 flex size-6 -translate-y-1/2 cursor-ew-resize touch-none items-center justify-center rounded-full border shadow-sm select-none'
          data-variant='unstyled'
          type='button'
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <GripVerticalIcon className='size-3.5' />
        </button>
      </div>
    </section>
  );
};

export default Demo;
