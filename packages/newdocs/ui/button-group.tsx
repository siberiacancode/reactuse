import type { VariantProps } from 'class-variance-authority';

import { cn } from '@docs/lib/utils';
import { Separator } from '@docs/ui/separator';
import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';

const buttonGroupVariants = cva(
  "group/button-group flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg!',
        vertical:
          'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg!'
      }
    },
    defaultVariants: {
      orientation: 'horizontal'
    }
  }
);

const ButtonGroup = ({
  className,
  orientation,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>) => (
  <div
    className={cn(buttonGroupVariants({ orientation }), className)}
    data-orientation={orientation}
    data-slot='button-group'
    role='group'
    {...props}
  />
);

const ButtonGroupText = ({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> & {
  asChild?: boolean;
}) => {
  const Comp = asChild ? Slot.Root : 'div';

  return (
    <Comp
      className={cn(
        "bg-muted flex items-center gap-2 rounded-lg border px-2.5 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
};

const ButtonGroupSeparator = ({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof Separator>) => (
  <Separator
    className={cn(
      'bg-input relative self-stretch data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto',
      className
    )}
    data-slot='button-group-separator'
    orientation={orientation}
    {...props}
  />
);

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants };
