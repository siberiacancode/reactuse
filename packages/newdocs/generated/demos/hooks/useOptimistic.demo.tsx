'use client'

import {
  useDebounceCallback,
  useDisclosure,
  useMutation,
  useOptimistic,
  useQuery
} from '@siberiacancode/reactuse';
import { HeartIcon, XIcon } from 'lucide-react';
import { createPortal } from 'react-dom';

import { cn } from '@/utils/lib';

const POST = {
  name: 'reactuse',
  handle: '@reactuse',
  time: '2h',
  text: 'Like this post to see optimistic updates in action — the UI reacts instantly, but every 5th request fails and rolls back.',
  liked: false,
  likes: 12
};

type Post = typeof POST;

let attempt = 0;

// eslint-disable-next-line e18e/prefer-timer-args
const fetchPost = () => new Promise<Post>((resolve) => setTimeout(() => resolve({ ...POST }), 500));

const toggleLike = (next: boolean) =>
  new Promise<Post>((resolve, reject) => {
    setTimeout(() => {
      attempt += 1;
      if (attempt % 5 === 0) {
        reject(new Error('Network error'));
        return;
      }
      POST.liked = next;
      POST.likes = 12 + (next ? 1 : 0);
      resolve({ ...POST });
    }, 500);
  });

const Demo = () => {
  const postQuery = useQuery(fetchPost, { enabled: false, placeholderData: POST });
  const toggleLikeMutation = useMutation(toggleLike);

  const data = postQuery.data!;

  const toast = useDisclosure();
  const [optimisticLiked, updateOptimistic, setOptimisticLiked] = useOptimistic(
    data.liked,
    (_, value: boolean) => value
  );

  const commit = useDebounceCallback((next: boolean) => {
    if (next === data.liked) return;

    const promise = (async () => {
      try {
        await toggleLikeMutation.mutateAsync(next);
        await postQuery.refetch();
      } catch {
        toast.open();
        setTimeout(toast.close, 1500);
        throw new Error('Network error');
      }
    })();

    updateOptimistic(next, promise);
  }, 600);

  const onLike = () => {
    const next = !optimisticLiked;
    setOptimisticLiked(next);
    commit(next);
  };

  const likeCount = data.likes + (optimisticLiked === data.liked ? 0 : optimisticLiked ? 1 : -1);

  return (
    <section className='relative flex w-full max-w-md flex-col py-4'>
      <article className='flex flex-col gap-3'>
        <div className='flex items-center gap-2'>
          <div className='bg-muted flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full'>
            <img alt='reactuse' className='size-6' src='https://reactuse.org/logo.svg' />
          </div>
          <span className='text-foreground text-sm font-semibold'>{data.name}</span>
          <span className='text-muted-foreground text-xs'>{data.handle}</span>
          <span className='text-muted-foreground text-xs'>· {data.time}</span>
        </div>

        <p className='text-foreground text-sm leading-relaxed'>{data.text}</p>

        <div className='flex items-center'>
          <button
            className={cn(
              'flex items-center gap-1.5 px-0! text-sm transition-colors',
              optimisticLiked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
            )}
            data-variant='unstyled'
            type='button'
            onClick={onLike}
          >
            <HeartIcon className='size-4' fill={optimisticLiked ? 'currentColor' : 'none'} />
            {likeCount}
          </button>
        </div>
      </article>

      {toast.opened &&
        createPortal(
          <div className='animate-in fade-in slide-in-from-bottom-4 fixed right-4 bottom-6 left-4 flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3.5 text-sm font-medium text-gray-900 shadow-xl duration-300 sm:right-6 sm:left-auto sm:w-auto sm:min-w-72 dark:border-white/10 dark:bg-neutral-900 dark:text-white'>
            <div className='bg-destructive flex size-6 shrink-0 items-center justify-center rounded-full'>
              <XIcon className='size-3.5 text-white' strokeWidth={3} />
            </div>
            Failed to change like
          </div>,
          document.body
        )}
    </section>
  );
};

export default Demo;
