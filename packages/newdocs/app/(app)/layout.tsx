import { SiteHeader } from '@docs/components/site-header';

export const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className='bg-background relative z-10 flex min-h-svh flex-col' data-slot='layout'>
    <SiteHeader />
    <main className='flex flex-1 flex-col'>{children}</main>
  </div>
);

export default AppLayout;
