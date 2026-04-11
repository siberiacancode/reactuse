import { cn } from '@docs/lib/utils';

const PageHeader = ({ className, children, ...props }: React.ComponentProps<'section'>) => (
    <section className={cn('border-grid', className)} {...props}>
      <div className='container-wrapper'>
        <div className='container flex flex-col items-center gap-2 px-6 py-8 text-center md:py-16 lg:py-20 xl:gap-4'>
          {children}
        </div>
      </div>
    </section>
  )

const PageHeaderHeading = ({ className, ...props }: React.ComponentProps<'h1'>) => (
    <h1
      className={cn(
        'text-primary leading-tighter max-w-3xl text-3xl font-semibold tracking-tight text-balance md:text-2xl lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter',
        className
      )}
      {...props}
    />
  )

const PageHeaderDescription = ({ className, ...props }: React.ComponentProps<'p'>) => (
    <p
      className={cn('text-foreground max-w-4xl text-base text-balance lg:text-xl md:text-base', className)}
      {...props}
    />
  )

const PageActions = ({ className, ...props }: React.ComponentProps<'div'>) => (
    <div
      className={cn(
        'flex w-full items-center justify-center gap-2 pt-2 **:data-[slot=button]:shadow-none',
        className
      )}
      {...props}
    />
  )

export { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading };
