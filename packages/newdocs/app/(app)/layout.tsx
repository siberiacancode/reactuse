import { LandingHeader } from '@docs/components/landing-header';

export const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className='bg-background relative z-10 flex min-h-svh flex-col' data-slot='layout'>
    <LandingHeader />
    <main className='flex flex-1 flex-col'>{children}</main>
  </div>
);

export default AppLayout;
