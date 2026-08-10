'use client';

import type { VariantProps } from 'class-variance-authority';

import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { useMediaQuery } from '@siberiacancode/reactuse';
import { cva } from 'class-variance-authority';
import { PanelLeftIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Separator } from '@/src/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/src/components/ui/sheet';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/components/ui/tooltip';
import { cn } from '@/src/lib/index';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';
const SIDEBAR_MOBILE_QUERY = '(max-width: 767px)';

interface SidebarContextProps {
  isMobile: boolean;
  open: boolean;
  openMobile: boolean;
  state: 'collapsed' | 'expanded';
  setOpen: (open: boolean) => void;
  setOpenMobile: (open: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}

const SidebarProvider = ({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const isMobile = useMediaQuery(SIDEBAR_MOBILE_QUERY);
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: ((value: boolean) => boolean) | boolean) => {
      const openState = typeof value === 'function' ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(
    () => (isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)),
    [isMobile, setOpen, setOpenMobile]
  );

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? 'expanded' : 'collapsed';

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        className={cn(
          'group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full',
          className
        )}
        style={
          {
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
            ...style
          } as React.CSSProperties
        }
        data-slot='sidebar-wrapper'
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

const Sidebar = ({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  dir,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right';
  variant?: 'floating' | 'inset' | 'sidebar';
  collapsible?: 'icon' | 'none' | 'offcanvas';
}) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === 'none') {
    return (
      <div
        className={cn(
          'bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col',
          className
        )}
        data-slot='sidebar'
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE
            } as React.CSSProperties
          }
          className='bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden'
          data-mobile='true'
          data-sidebar='sidebar'
          data-slot='sidebar'
          dir={dir}
          side={side}
        >
          <SheetHeader className='sr-only'>
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className='flex h-full w-full flex-col'>{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className='group peer text-sidebar-foreground hidden md:block'
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-side={side}
      data-slot='sidebar'
      data-state={state}
      data-variant={variant}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={cn(
          'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)'
        )}
        data-slot='sidebar-gap'
      />
      <div
        className={cn(
          'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex',
          // Adjust the padding for floating and inset variants.
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
          className
        )}
        data-side={side}
        data-slot='sidebar-container'
        {...props}
      >
        <div
          className='bg-sidebar group-data-[variant=floating]:ring-sidebar-border flex size-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1'
          data-sidebar='sidebar'
          data-slot='sidebar-inner'
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const SidebarTrigger = ({ className, onClick, ...props }: React.ComponentProps<typeof Button>) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      className={cn(className)}
      data-sidebar='trigger'
      data-slot='sidebar-trigger'
      size='icon-sm'
      variant='ghost'
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className='sr-only'>Toggle Sidebar</span>
    </Button>
  );
};

const SidebarRail = ({ className, ...props }: React.ComponentProps<'button'>) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      className={cn(
        'hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2',
        'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className
      )}
      aria-label='Toggle Sidebar'
      data-sidebar='rail'
      data-slot='sidebar-rail'
      tabIndex={-1}
      title='Toggle Sidebar'
      onClick={toggleSidebar}
      {...props}
    />
  );
};

const SidebarInset = ({ className, ...props }: React.ComponentProps<'main'>) => (
  <main
    className={cn(
      'bg-background relative flex w-full flex-1 flex-col md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
      className
    )}
    data-slot='sidebar-inset'
    {...props}
  />
);

const SidebarInput = ({ className, ...props }: React.ComponentProps<typeof Input>) => (
  <Input
    className={cn('bg-background h-8 w-full shadow-none', className)}
    data-sidebar='input'
    data-slot='sidebar-input'
    {...props}
  />
);

const SidebarHeader = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn('flex flex-col gap-2 p-2', className)}
    data-sidebar='header'
    data-slot='sidebar-header'
    {...props}
  />
);

const SidebarFooter = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn('flex flex-col gap-2 p-2', className)}
    data-sidebar='footer'
    data-slot='sidebar-footer'
    {...props}
  />
);

const SidebarSeparator = ({ className, ...props }: React.ComponentProps<typeof Separator>) => (
  <Separator
    className={cn('bg-sidebar-border mx-2 w-auto', className)}
    data-sidebar='separator'
    data-slot='sidebar-separator'
    {...props}
  />
);

const SidebarContent = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn(
      'no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
      className
    )}
    data-sidebar='content'
    data-slot='sidebar-content'
    {...props}
  />
);

const SidebarGroup = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
    data-sidebar='group'
    data-slot='sidebar-group'
    {...props}
  />
);

function SidebarGroupLabel({
  className,
  render,
  ...props
}: useRender.ComponentProps<'div'> & React.ComponentProps<'div'>) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cn(
          'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
          className
        )
      },
      props
    ),
    render,
    state: {
      slot: 'sidebar-group-label',
      sidebar: 'group-label'
    }
  });
}

function SidebarGroupAction({
  className,
  render,
  ...props
}: useRender.ComponentProps<'button'> & React.ComponentProps<'button'>) {
  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        className: cn(
          'absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0',
          className
        )
      },
      props
    ),
    render,
    state: {
      slot: 'sidebar-group-action',
      sidebar: 'group-action'
    }
  });
}

const SidebarGroupContent = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn('w-full text-sm', className)}
    data-sidebar='group-content'
    data-slot='sidebar-group-content'
    {...props}
  />
);

const SidebarMenu = ({ className, ...props }: React.ComponentProps<'ul'>) => (
  <ul
    className={cn('flex w-full min-w-0 flex-col gap-0', className)}
    data-sidebar='menu'
    data-slot='sidebar-menu'
    {...props}
  />
);

const SidebarMenuItem = ({ className, ...props }: React.ComponentProps<'li'>) => (
  <li
    className={cn('group/menu-item relative', className)}
    data-sidebar='menu-item'
    data-slot='sidebar-menu-item'
    {...props}
  />
);

const sidebarMenuButtonVariants = cva(
  'peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate',
  {
    variants: {
      variant: {
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline:
          'bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]'
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

const SidebarMenuButton = ({
  render,
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  ...props
}: useRender.ComponentProps<'button'> &
  React.ComponentProps<'button'> & {
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & VariantProps<typeof sidebarMenuButtonVariants>) => {
  const { isMobile, state } = useSidebar();
  const comp = useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        className: cn(sidebarMenuButtonVariants({ variant, size }), className)
      },
      props
    ),
    render: !tooltip ? render : <TooltipTrigger render={render} />,
    state: {
      slot: 'sidebar-menu-button',
      sidebar: 'menu-button',
      size,
      active: isActive
    }
  });

  if (!tooltip) {
    return comp;
  }

  if (typeof tooltip === 'string') {
    tooltip = {
      children: tooltip
    };
  }

  return (
    <Tooltip>
      {comp}
      <TooltipContent
        align='center'
        hidden={state !== 'collapsed' || isMobile}
        side='right'
        {...tooltip}
      />
    </Tooltip>
  );
};

function SidebarMenuAction({
  className,
  render,
  showOnHover = false,
  ...props
}: useRender.ComponentProps<'button'> &
  React.ComponentProps<'button'> & {
    showOnHover?: boolean;
  }) {
  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        className: cn(
          'absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0',
          showOnHover &&
            'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0',
          className
        )
      },
      props
    ),
    render,
    state: {
      slot: 'sidebar-menu-action',
      sidebar: 'menu-action'
    }
  });
}

const SidebarMenuBadge = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn(
      'text-sidebar-foreground peer-hover/menu-button:text-sidebar-accent-foreground peer-data-active/menu-button:text-sidebar-accent-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none group-data-[collapsible=icon]:hidden peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1',
      className
    )}
    data-sidebar='menu-badge'
    data-slot='sidebar-menu-badge'
    {...props}
  />
);

const SidebarMenuSkeleton = ({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<'div'> & {
  showIcon?: boolean;
}) => {
  // Random width between 50 to 90%.
  const [width] = React.useState(() => `${Math.floor(Math.random() * 40) + 50}%`);

  return (
    <div
      className={cn('flex h-8 items-center gap-2 rounded-md px-2', className)}
      data-sidebar='menu-skeleton'
      data-slot='sidebar-menu-skeleton'
      {...props}
    >
      {showIcon && <Skeleton className='size-4 rounded-md' data-sidebar='menu-skeleton-icon' />}
      <Skeleton
        style={
          {
            '--skeleton-width': width
          } as React.CSSProperties
        }
        className='h-4 max-w-(--skeleton-width) flex-1'
        data-sidebar='menu-skeleton-text'
      />
    </div>
  );
};

const SidebarMenuSub = ({ className, ...props }: React.ComponentProps<'ul'>) => (
  <ul
    className={cn(
      'border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5 group-data-[collapsible=icon]:hidden',
      className
    )}
    data-sidebar='menu-sub'
    data-slot='sidebar-menu-sub'
    {...props}
  />
);

const SidebarMenuSubItem = ({ className, ...props }: React.ComponentProps<'li'>) => (
  <li
    className={cn('group/menu-sub-item relative', className)}
    data-sidebar='menu-sub-item'
    data-slot='sidebar-menu-sub-item'
    {...props}
  />
);

function SidebarMenuSubButton({
  render,
  size = 'md',
  isActive = false,
  className,
  ...props
}: useRender.ComponentProps<'a'> &
  React.ComponentProps<'a'> & {
    size?: 'md' | 'sm';
    isActive?: boolean;
  }) {
  return useRender({
    defaultTagName: 'a',
    props: mergeProps<'a'>(
      {
        className: cn(
          'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden group-data-[collapsible=icon]:hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[size=md]:text-sm data-[size=sm]:text-xs data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground',
          className
        )
      },
      props
    ),
    render,
    state: {
      slot: 'sidebar-menu-sub-button',
      sidebar: 'menu-sub-button',
      size,
      active: isActive
    }
  });
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
};
