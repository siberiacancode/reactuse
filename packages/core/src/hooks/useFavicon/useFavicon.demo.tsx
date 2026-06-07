import { useFavicon } from '@siberiacancode/reactuse';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const FAVICONS = [
  { id: 'reactuse', label: 'reactuse', url: 'https://reactuse.org/favicon.ico' },
  { id: 'gitlab', label: 'GitLab', url: 'https://cdn.simpleicons.org/gitlab' },
  { id: 'vercel', label: 'Vercel', url: 'https://cdn.simpleicons.org/vercel/000000/ffffff' },
  { id: 'discord', label: 'Discord', url: 'https://cdn.simpleicons.org/discord' }
];

const Demo = () => {
  const favicon = useFavicon(FAVICONS[0].url);

  return (
    <section className='flex w-full max-w-sm flex-col gap-3 p-4'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-foreground text-sm font-semibold'>Choose tab icon</h2>
        <p className='text-muted-foreground text-xs'>
          Click any tile to update the browser tab favicon.
        </p>
      </div>

      <div className='grid grid-cols-2 gap-2 md:grid-cols-4'>
        {FAVICONS.map((item) => {
          const isActive = favicon.href === item.url;
          return (
            <div
              key={item.id}
              className={cn(
                'border-border bg-card hover:bg-accent/30 relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border p-2 transition-colors',
                isActive && 'border-foreground bg-accent/30'
              )}
              aria-label={item.label}
              aria-pressed={isActive}
              role='button'
              tabIndex={0}
              onClick={() => favicon.set(item.url)}
            >
              <img alt={item.label} className='size-7 object-contain' src={item.url} />
              <span className='text-muted-foreground text-[10px] font-medium'>{item.label}</span>

              {isActive && (
                <span className='bg-foreground text-background absolute top-1.5 right-1.5 flex size-3.5 items-center justify-center rounded-full'>
                  <CheckIcon className='size-2.5' strokeWidth={3} />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Demo;
