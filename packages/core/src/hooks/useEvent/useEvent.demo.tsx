import { useEvent } from '@siberiacancode/reactuse';
import { ArchiveIcon, ArchiveRestoreIcon, StarIcon } from 'lucide-react';
import { memo, useState } from 'react';

import { cn } from '@/utils/lib';

interface Email {
  archived: boolean;
  from: string;
  id: number;
  logo: string;
  preview: string;
  starred: boolean;
  subject: string;
  time: string;
  unread: boolean;
}

interface EmailItemProps {
  email: Email;
  onArchive: (id: number) => void;
  onStar: (id: number) => void;
}

const EmailItem = memo(({ email, onStar, onArchive }: EmailItemProps) => (
  <div
    className={cn(
      'border-border bg-card flex items-center gap-3 border-b px-3 py-2.5 last:border-b-0',
      email.unread && !email.archived && 'bg-accent/20'
    )}
  >
    <div className='bg-muted flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full p-1'>
      <img alt={email.from} className='size-7 object-contain' src={email.logo} />
    </div>

    <div className='flex min-w-0 flex-1 flex-col'>
      <div className='flex items-center justify-between gap-2'>
        <span
          className={cn(
            'truncate text-sm',
            email.unread && !email.archived ? 'text-foreground font-semibold' : 'text-foreground'
          )}
        >
          {email.from}
        </span>
        <span className='text-muted-foreground shrink-0 text-[10px]'>{email.time}</span>
      </div>
      <span
        className={cn(
          'truncate text-xs',
          email.unread && !email.archived ? 'text-foreground font-medium' : 'text-muted-foreground'
        )}
      >
        {email.subject}
      </span>
      <span className='text-muted-foreground truncate text-xs'>{email.preview}</span>
    </div>

    <div className='flex shrink-0 items-center gap-0.5'>
      <button
        aria-label={email.starred ? 'Unstar' : 'Star'}
        data-size='icon-sm'
        data-variant='ghost'
        type='button'
        onClick={() => onStar(email.id)}
      >
        <StarIcon
          className={cn(
            'size-3.5 transition-colors',
            email.starred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
          )}
        />
      </button>
      <button
        aria-label={email.archived ? 'Move to inbox' : 'Archive'}
        data-size='icon-sm'
        data-variant='ghost'
        type='button'
        onClick={() => onArchive(email.id)}
      >
        {email.archived && <ArchiveRestoreIcon className='size-3.5' />}
        {!email.archived && <ArchiveIcon className='size-3.5' />}
      </button>
    </div>
  </div>
));
EmailItem.displayName = 'EmailItem';

const INITIAL_EMAILS: Email[] = [
  {
    id: 1,
    from: 'GitLab',
    logo: 'https://cdn.simpleicons.org/gitlab',
    subject: 'New star on reactuse',
    preview: 'siberiacancode/reactuse just got starred by debabin',
    time: '2m',
    unread: true,
    starred: false,
    archived: false
  },
  {
    id: 2,
    from: 'Vercel',
    logo: 'https://cdn.simpleicons.org/vercel/000000/ffffff',
    subject: 'Deployment ready · reactuse.org',
    preview: 'Your latest deployment finished in 24 seconds',
    time: '14m',
    unread: true,
    starred: true,
    archived: false
  },
  {
    id: 3,
    from: 'Google',
    logo: 'https://cdn.simpleicons.org/google',
    subject: 'Security alert for your account',
    preview: 'A new sign-in from MacBook in Novosibirsk',
    time: '1h',
    unread: false,
    starred: false,
    archived: false
  },
  {
    id: 4,
    from: 'Discord',
    logo: 'https://cdn.simpleicons.org/discord',
    subject: '3 new messages in #general',
    preview: '@charmander: anyone tried the new useEvent hook yet?',
    time: '3h',
    unread: false,
    starred: false,
    archived: false
  },
  {
    id: 5,
    from: 'npm',
    logo: 'https://cdn.simpleicons.org/npm',
    subject: 'Weekly download report',
    preview: 'reactuse hit 12,400 downloads this week 🎉',
    time: 'Yesterday',
    unread: false,
    starred: true,
    archived: true
  }
];

type Tab = 'archive' | 'favorites' | 'inbox';

const Demo = () => {
  const [emails, setEmails] = useState<Email[]>(INITIAL_EMAILS);
  const [tab, setTab] = useState<Tab>('inbox');

  const onStar = useEvent((id: number) => {
    setEmails((current) =>
      current.map((email) => (email.id === id ? { ...email, starred: !email.starred } : email))
    );
  });

  const onArchive = useEvent((id: number) => {
    setEmails((current) =>
      current.map((email) =>
        email.id === id ? { ...email, archived: !email.archived, unread: false } : email
      )
    );
  });

  const visibleEmails = emails.filter((email) => {
    if (tab === 'inbox') return !email.archived;
    if (tab === 'favorites') return email.starred;
    return email.archived;
  });

  return (
    <section className='flex w-full max-w-md flex-col gap-3 p-4'>
      <h2 className='text-foreground px-1 text-sm font-semibold'>Inbox</h2>

      <div data-slot='tabs'>
        <div data-slot='tabs-list'>
          <button
            data-state={cn(tab === 'inbox' && 'active')}
            data-variant='tabs-trigger'
            type='button'
            onClick={() => setTab('inbox')}
          >
            Inbox
          </button>
          <button
            data-state={cn(tab === 'favorites' && 'active')}
            data-variant='tabs-trigger'
            type='button'
            onClick={() => setTab('favorites')}
          >
            Favorites
          </button>
          <button
            data-state={cn(tab === 'archive' && 'active')}
            data-variant='tabs-trigger'
            type='button'
            onClick={() => setTab('archive')}
          >
            Archive
          </button>
        </div>
      </div>

      <div className='border-border bg-card overflow-hidden rounded-xl border shadow-sm'>
        {visibleEmails.map((email) => (
          <EmailItem key={email.id} email={email} onArchive={onArchive} onStar={onStar} />
        ))}

        {!visibleEmails.length && (
          <div className='text-muted-foreground py-8 text-center text-xs'>No emails 📭</div>
        )}
      </div>
    </section>
  );
};

export default Demo;
