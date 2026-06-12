interface Stat {
  label: string;
  value: string;
}

interface LandingStatsProps {
  stats: Stat[];
}

export const LandingStats = ({ stats }: LandingStatsProps) => (
  <div className='border-border bg-card/30 relative overflow-hidden border-y py-6'>
    <div className='animate-marquee flex whitespace-nowrap'>
      {[...stats, ...stats, ...stats, ...stats].map((stat, index) => (
        <div key={`${stat.label}-${index}`} className='mx-12 flex items-center gap-3'>
          <span className='font-display text-foreground text-3xl font-bold md:text-4xl'>
            {stat.value}
          </span>
          <span className='text-muted-foreground text-sm tracking-wider uppercase md:text-base'>
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  </div>
);
