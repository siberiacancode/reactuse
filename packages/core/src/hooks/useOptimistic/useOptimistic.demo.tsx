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

const REGULAR_POST: Post = {
  id: 'regular',
  name: 'React',
  handle: '@reactjs',
  logo: 'https://cdn.simpleicons.org/react',
  text: 'Try liking or deleting this post — changes appear instantly, then sync or roll back.',
  time: '5h',
  pinned: false,
  liked: false,
  likes: 42
};

let POSTS: Post[] = [
  {
    id: 'pinned',
    name: 'reactuse',
    handle: '@reactuse',
    logo: 'https://reactuse.org/logo.svg',
    text: 'Welcome to reactuse — a collection of essential React hooks. This post is pinned and cannot be deleted.',
    time: '2h',
    pinned: true,
    liked: false,
    likes: 128
  },
  { ...REGULAR_POST }
];

const fetchPosts = () =>
  new Promise<Post[]>((resolve) =>
    setTimeout(() => resolve(POSTS.map((post) => ({ ...post }))), 500)
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

const restorePost = () =>
  new Promise<void>((resolve) =>
    setTimeout(() => {
      POSTS = [...POSTS, { ...REGULAR_POST }];
      resolve();
    }, 800)
  );

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
  onLike: (post: Post) => void;
}

const PostCard = ({ post, onLike, onDelete }: PostCardProps) => {
  const menu = useDisclosure();
  const ref = useClickOutside<HTMLDivElement>(() => menu.close());

  return (
    <article className='border-border flex flex-col gap-2 border-b py-3 last:border-b-0'>
      <div className='flex items-center gap-2'>
        <div className='bg-muted flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full'>
          <img alt={post.name} className='size-5' src={post.logo} />
        </div>
        <span className='text-foreground text-sm font-semibold'>{post.name}</span>
        <span className='text-muted-foreground text-xs'>{post.handle}</span>
        <span className='text-muted-foreground text-xs'>· {post.time}</span>

        {post.pinned && <PinIcon className='text-muted-foreground ml-auto size-4 fill-current' />}

        {!post.pinned && (
          <div className='relative ml-auto'>
            <button
              aria-label='More'
              className='text-muted-foreground hover:text-foreground'
              data-size='icon-sm'
              data-variant='ghost'
              type='button'
              onClick={menu.toggle}
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
                    onDelete(post.id);
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

      <p className='text-foreground text-sm leading-relaxed'>{post.text}</p>

      <button
        className={cn(
          'flex w-fit items-center gap-1.5 px-0! text-sm transition-colors',
          post.liked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
        )}
        data-variant='unstyled'
        type='button'
        onClick={() => onLike(post)}
      >
        <HeartIcon className='size-4' fill={post.liked ? 'currentColor' : 'none'} />
        {post.likes}
      </button>
    </article>
  );
};

const Demo = () => {
  const postsQuery = useQuery(fetchPosts, { enabled: false, placeholderData: POSTS });
  const likeMutation = useMutation(({ id, liked }: { id: string; liked: boolean }) =>
    likePost(id, liked)
  );
  const deleteMutation = useMutation(deletePost);
  const restoreMutation = useMutation(restorePost);

  const data = postsQuery.data!;

  const [posts, updateOptimistic, setPosts] = useOptimistic(data, (_, value) => value);

  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const likeCommit = useDebounceCallback((id: string, liked: boolean, optimistic: Post[]) => {
    const promise = (async () => {
      await likeMutation.mutateAsync({ id, liked });
      await postsQuery.fetch();
    })();
    updateOptimistic(optimistic, promise);
  }, 600);

  const onLike = (target: Post) => {
    const liked = !target.liked;
    const optimistic = posts.map((item) =>
      item.id === target.id ? { ...item, liked, likes: item.likes + (liked ? 1 : -1) } : item
    );
    setPosts(optimistic);
    likeCommit(target.id, liked, optimistic);
  };

  const onDelete = (id: string) => {
    setDeletedIds((current) => [...current, id]);

    const promise = (async () => {
      await deleteMutation.mutateAsync(id);
      await postsQuery.fetch();
    })();
    updateOptimistic(
      posts.filter((item) => item.id !== id),
      promise
    );
  };

  const onUndo = () => {
    setDeletedIds([]);

    const promise = (async () => {
      await restoreMutation.mutateAsync();
      await postsQuery.fetch();
    })();
    updateOptimistic([...posts, { ...REGULAR_POST }], promise);
  };

  return (
    <section className='flex w-full max-w-md flex-col py-4'>
      {posts.map((item) => (
        <PostCard key={item.id} post={item} onDelete={onDelete} onLike={onLike} />
      ))}

      {!!deletedIds.length && (
        <div className='flex items-center justify-between pt-3'>
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
      )}
    </section>
  );
};

export default Demo;
