import {
  BugIcon,
  ClockIcon,
  CuboidIcon,
  DramaIcon,
  GlobeIcon,
  LoaderIcon,
  PictureInPictureIcon,
  RecycleIcon,
  TelescopeIcon,
  WrenchIcon,
  UserIcon,
  WandSparklesIcon
} from 'lucide-react';

export const CATEGORIES = {
  async: {
    Icon: LoaderIcon,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  browser: {
    Icon: GlobeIcon,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  time: {
    Icon: ClockIcon,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  elements: {
    Icon: PictureInPictureIcon,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  humor: {
    Icon: DramaIcon,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  state: {
    Icon: CuboidIcon,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  debug: {
    Icon: BugIcon,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  sensors: {
    Icon: TelescopeIcon,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  lifecycle: {
    Icon: RecycleIcon,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  utilities: {
    Icon: WrenchIcon,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  user: {
    Icon: UserIcon,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  helpers: {
    Icon: WandSparklesIcon,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  }
};
