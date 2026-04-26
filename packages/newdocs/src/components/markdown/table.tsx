import { cn } from '@/src/lib/cn';

export const TABLE_COMPONENTS = {
  table: ({ className, ...props }: React.ComponentProps<'table'>) => (
    <div className='no-scrollbar my-6 w-full overflow-y-auto rounded-xl border'>
      <table
        className={cn(
          'relative w-full overflow-hidden border-none text-sm [&_tbody_tr:last-child]:border-b-0',
          className
        )}
        {...props}
      />
    </div>
  ),
  thead: ({ className, ...props }: React.ComponentProps<'thead'>) => (
    <thead className={cn('bg-muted/50', className)} {...props} />
  ),
  tbody: ({ className, ...props }: React.ComponentProps<'tbody'>) => (
    <tbody className={cn('bg-muted/50', className)} {...props} />
  ),
  tr: ({ className, ...props }: React.ComponentProps<'tr'>) => (
    <tr className={cn('m-0 border-b', className)} {...props} />
  ),
  th: ({ className, ...props }: React.ComponentProps<'th'>) => (
    <th
      className={cn(
        'px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.ComponentProps<'td'>) => (
    <td
      className={cn(
        'px-4 py-2 text-left whitespace-nowrap [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  )
};
