import type { ClassValue } from '@siberiacancode/reactuse';

import { cn as clsx } from '@siberiacancode/reactuse';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
