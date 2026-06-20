import { useToggle } from '@siberiacancode/reactuse';
import {
  ArrowDownAZIcon,
  ArrowDownZAIcon,
  ArrowUpDownIcon,
  MoreHorizontalIcon
} from 'lucide-react';
import { Fragment } from 'react';

import { cn } from '@/utils/lib';

interface Member {
  email: string;
  id: string;
  initials: string;
  name: string;
  role: string;
  status: 'active' | 'away';
}

const MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Sofia Lin',
    role: 'Product Designer',
    email: 'sofia@reactuse.dev',
    initials: 'SL',
    status: 'active'
  },
  {
    id: '2',
    name: 'Alex Carter',
    role: 'Frontend Engineer',
    email: 'alex@reactuse.dev',
    initials: 'AC',
    status: 'active'
  },
  {
    id: '3',
    name: 'Maria Gomez',
    role: 'Engineering Manager',
    email: 'maria@reactuse.dev',
    initials: 'MG',
    status: 'away'
  },
  {
    id: '4',
    name: 'Noah Webb',
    role: 'Backend Engineer',
    email: 'noah@reactuse.dev',
    initials: 'NW',
    status: 'active'
  },
  {
    id: '5',
    name: 'Emma Stone',
    role: 'QA Engineer',
    email: 'emma@reactuse.dev',
    initials: 'ES',
    status: 'away'
  }
];

const SORT_LABEL = {
  default: 'Default',
  asc: 'Name A–Z',
  desc: 'Name Z–A'
} as const;

const Demo = () => {
  const [sort, toggleSort] = useToggle(['default', 'asc', 'desc'] as const);

  const members = MEMBERS.toSorted((a, b) => {
    if (sort === 'asc') return a.name.localeCompare(b.name);
    if (sort === 'desc') return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <section className='flex w-full max-w-md flex-col gap-3 p-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-foreground text-base font-semibold'>Team members</h3>
        <button
          className='inline-flex items-center gap-1.5 rounded-full!'
          data-size='sm'
          data-variant='outline'
          type='button'
          onClick={() => toggleSort()}
        >
          {sort === 'default' && <ArrowUpDownIcon className='size-4' />}
          {sort === 'asc' && <ArrowDownAZIcon className='size-4' />}
          {sort === 'desc' && <ArrowDownZAIcon className='size-4' />}
          {SORT_LABEL[sort]}
        </button>
      </div>

      <div className='border-border bg-card flex flex-col overflow-hidden rounded-xl border'>
        {members.map((member, index) => (
          <Fragment key={member.id}>
            {index > 0 && <div data-slot='separator' />}
            <div className='hover:bg-muted/40 flex items-center gap-3 px-3 py-3 transition-colors'>
              <div className='relative shrink-0'>
                <div data-size='lg' data-slot='avatar'>
                  <span data-slot='avatar-fallback'>{member.initials}</span>
                </div>
                <span
                  className={cn(
                    'ring-card absolute right-0 bottom-0 size-2.5 rounded-full ring-2',
                    member.status === 'active' ? 'bg-green-500' : 'bg-muted-foreground'
                  )}
                />
              </div>

              <div className='flex min-w-0 flex-1 flex-col leading-tight'>
                <span className='text-foreground truncate text-sm font-medium'>{member.name}</span>
                <span className='text-muted-foreground truncate text-xs'>{member.role}</span>
              </div>

              <div className='dropdown'>
                <button
                  aria-label='Actions'
                  className='rounded-full!'
                  data-size='icon-sm'
                  data-variant='ghost'
                  type='button'
                >
                  <MoreHorizontalIcon className='size-4' />
                </button>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
};

export default Demo;
