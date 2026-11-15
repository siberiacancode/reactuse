'use client';

import {
  useClickOutside,
  useDebounceCallback,
  useDisclosure,
  useMutation,
  useOptimistic,
  useQuery
} from '@siberiacancode/reactuse';
import { HeartIcon, MoreHorizontalIcon, PinIcon, Trash2Icon, Undo2Icon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

interface Post {
  handle: string;
  id: string;
  liked: boolean;
  likes: number;
  logo: string;
  name: string;
  pinned: boolean;
  text: string;
  time: string;
}

const POST_IDS = ['pinned', 'regular'] as const;

const INITIAL_POSTS: Post[] = [
  {
    id: 'pinned',
    name: 'reactuse',
    handle: '@reactuse',
    logo: 'https://reactuse.org/logo.svg',
    text: 'Welcome to reactuse - a collection of essential React hooks. This post is pinned and cannot be deleted.',
    time: '2h',
    pinned: true,
    liked: false,
    likes: 128
  },
  {
    id: 'regular',
    name: 'React',
    handle: '@reactjs',
    logo: 'https://cdn.simpleicons.org/react',
    text: 'Try liking or deleting this post - changes appear instantly, then sync or roll back.',
    time: '5h',
    pinned: false,
    liked: false,
    likes: 42
  }
];

let POSTS: Post[] = INITIAL_POSTS.map((post) => ({ ...post }));

const getInitialPost = (id: string) => INITIAL_POSTS.find((post) => post.id === id) ?? null;

const fetchPost = (id: string) =>
  new Promise<Post | null>((resolve) =>
    setTimeout(() => {
      const post = POSTS.find((item) => item.id === id);
      resolve(post ? { ...post } : null);
    }, 500)
  );

const likePost = (id: string, liked: boolean) =>
  new Promise<void>((resolve) =>
    setTimeout(() => {
      const post = POSTS.find((item) => item.id === id);

      if (post) {
        post.liked = liked;
        post.likes += liked ? 1 : -1;
      }

      resolve();
    }, 500)
  );

const deletePost = (id: string) =>
  new Promise<void>((resolve) =>
    setTimeout(() => {
      POSTS = POSTS.filter((post) => post.id !== id);
      resolve();
    }, 800)
  );

const restorePost = (id: string) =>
  new Promise<void>((resolve) =>
    setTimeout(() => {
      const source = getInitialPost(id);

      if (source && !POSTS.some((post) => post.id === id)) {
        POSTS = [...POSTS, { ...source }];
      }

      resolve();
    }, 800)
  );

const PostCard = ({ id }: { id: string }) => {
  const menu = useDisclosure();
  const ref = useClickOutside<HTMLDivElement>(() => menu.close());
  const [deleted, setDeleted] = useState(false);

  const postQuery = useQuery(() => fetchPost(id), {
    enabled: false,
    placeholderData: getInitialPost(id)
  });

  const likeMutation = useMutation(({ id: targetId, liked }: { id: string; liked: boolean }) =>
    likePost(targetId, liked)
  );
  const deleteMutation = useMutation(deletePost);
  const restoreMutation = useMutation(restorePost);

  const post = postQuery.data;
  const [optimisticPost, updateOptimistic, setOptimisticPost] = useOptimistic(
    post,
    (_, value: Post | null) => value
  );

  const likeCommit = useDebounceCallback((nextPost: Post) => {
    const promise = (async () => {
      await likeMutation.mutateAsync({ id: nextPost.id, liked: nextPost.liked });
      await postQuery.fetch();
    })();

    updateOptimistic(nextPost, promise);
  }, 600);

  const onLike = () => {
    if (!optimisticPost) return;

    const liked = !optimisticPost.liked;
    const nextPost = {
      ...optimisticPost,
      liked,
      likes: optimisticPost.likes + (liked ? 1 : -1)
    };

    setOptimisticPost(nextPost);
    likeCommit(nextPost);
  };

  const onDelete = () => {
    if (!optimisticPost) return;

    setDeleted(true);

    void (async () => {
      await deleteMutation.mutateAsync(optimisticPost.id);
      await postQuery.fetch();
    })();
  };

  const onUndo = () => {
    setDeleted(false);

    void (async () => {
      await restoreMutation.mutateAsync(id);
      await postQuery.fetch();
    })();
  };

  if (deleted) {
    return (
      <div className='border-border flex items-center justify-between border-b py-3 last:border-b-0'>
        <span className='text-muted-foreground text-sm'>Post deleted</span>
        <button
          data-size='sm'
          data-variant='ghost'
          disabled={restoreMutation.isLoading}
          type='button'
          onClick={onUndo}
        >
          <Undo2Icon className='size-3.5' />
          Undo
        </button>
      </div>
    );
  }

  if (!optimisticPost) return null;

  return (
    <article className='border-border flex flex-col gap-2 border-b py-3 last:border-b-0'>
      <div className='flex items-center gap-2'>
        <div className='bg-muted flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full'>
          <img alt={optimisticPost.name} className='size-5' src={optimisticPost.logo} />
        </div>
        <span className='text-foreground text-sm font-semibold'>{optimisticPost.name}</span>
        <span className='text-muted-foreground text-xs'>{optimisticPost.handle}</span>
        <span className='text-muted-foreground text-xs'>- {optimisticPost.time}</span>

        {optimisticPost.pinned && (
          <PinIcon className='text-muted-foreground ml-auto size-4 fill-current' />
        )}

        {!optimisticPost.pinned && (
          <div className='relative ml-auto'>
            <button
              aria-label='More'
              className='text-muted-foreground hover:text-foreground'
              data-size='icon-sm'
              data-variant='ghost'
              type='button'
              onClick={() => menu.toggle()}
            >
              <MoreHorizontalIcon className='size-4' />
            </button>

            {menu.opened && (
              <div
                ref={ref}
                className='absolute top-full right-0 mt-1'
                data-slot='dropdown-menu-content'
              >
                <div
                  data-slot='dropdown-menu-item'
                  data-variant='destructive'
                  onClick={() => {
                    menu.close();
                    onDelete();
                  }}
                >
                  <Trash2Icon />
                  Delete
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <p className='text-foreground text-sm leading-relaxed'>{optimisticPost.text}</p>

      <button
        className={cn(
          'flex w-fit items-center gap-1.5 px-0! text-sm transition-colors',
          optimisticPost.liked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
        )}
        data-variant='unstyled'
        type='button'
        onClick={onLike}
      >
        <HeartIcon className='size-4' fill={optimisticPost.liked ? 'currentColor' : 'none'} />
        {optimisticPost.likes}
      </button>
    </article>
  );
};

const Demo = () => (
  <section className='flex w-full max-w-md flex-col py-4'>
    {POST_IDS.map((id) => (
      <PostCard key={id} id={id} />
    ))}
  </section>
);

export default Demo;
