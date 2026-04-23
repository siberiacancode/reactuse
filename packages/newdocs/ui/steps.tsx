import type { ReactNode } from 'react';

export const Steps = ({ children }: { children: ReactNode }) => (
  <div className='fd-steps'>{children}</div>
);

export const Step = ({ children }: { children: ReactNode }) => (
  <div className='fd-step'>{children}</div>
);
