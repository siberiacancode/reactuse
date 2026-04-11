import { DocsSidebar } from '@docs/components/docs-sidebar';
import { SiteHeader } from '@docs/components/site-header';
import { source } from '@docs/lib/source';
import { SidebarProvider } from '@docs/ui/sidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className='container-wrapper flex flex-1 flex-col px-2'>
        <SidebarProvider
          style={
            {
              '--sidebar-width': 'calc(var(--spacing) * 72)'
            } as React.CSSProperties
          }
          className='3xl:fixed:container 3xl:fixed:px-3 min-h-min flex-1 items-start px-0 [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--top-spacing:calc(var(--spacing)*4)]'
        >
          <DocsSidebar tree={source.pageTree} />
          <div className='h-full w-full'>{children}</div>
        </SidebarProvider>
      </div>
    </>
  );
}
