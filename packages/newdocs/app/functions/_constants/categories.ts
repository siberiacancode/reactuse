import {
  IconBug,
  IconClock,
  IconCube,
  IconHorseToy,
  IconLoader,
  IconPictureInPictureOff,
  IconRecycle,
  IconTelescope,
  IconTools,
  IconUser,
  IconWorld
} from '@tabler/icons-react';

export const CATEGORIES = {
  async: {
    Icon: IconLoader,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  browser: {
    Icon: IconWorld,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  time: {
    Icon: IconClock,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  elements: {
    Icon: IconPictureInPictureOff,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  humor: {
    Icon: IconHorseToy,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  state: {
    Icon: IconCube,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  debug: {
    Icon: IconBug,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  sensors: {
    Icon: IconTelescope,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  lifecycle: {
    Icon: IconRecycle,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  utilities: {
    Icon: IconTools,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  },
  user: {
    Icon: IconUser,
    className: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
  }
};
