import type { ComponentProps } from 'react';

import { cn } from '@siberiacancode/reactuse';
import { Loader2Icon } from 'lucide-react';

type ButtonVariant = 'default' | 'outline' | 'secondary';

interface ButtonProps extends ComponentProps<'button'> {
  loading?: boolean;
  variant?: ButtonVariant;
}

const buttonVariants = {
  variant: {
    default: 'bg-primary! text-primary-foreground! hover:bg-primary/80!',
    secondary: 'bg-secondary! text-secondary-foreground! hover:bg-secondary/80!',
    outline:
      'border border-border! bg-background! text-foreground! hover:bg-muted! hover:text-foreground!'
  }
} as const;

const Button = ({
  className,
  disabled,
  loading = false,
  variant = 'default',
  children,
  ...props
}: ButtonProps) => (
  <button
    className={cn(
      'inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent px-4 py-2 text-sm font-medium whitespace-nowrap transition-all outline-none select-none',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
      'disabled:pointer-events-none disabled:opacity-50',
      buttonVariants.variant[variant],
      className
    )}
    disabled={disabled || loading}
    type='button'
    {...props}
  >
    {loading ? <Loader2Icon className='size-4 animate-spin' /> : children}
  </button>
);

const Demo = () => (
  <div className='flex flex-col gap-3 p-4'>
    <Button>Default</Button>
    <Button variant='secondary'>Secondary</Button>
    <Button variant='outline'>Outline</Button>
    <Button loading>Continue</Button>
  </div>
);

export default Demo;
