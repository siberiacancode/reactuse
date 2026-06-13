interface Stat {
  label: string;
  value: string;
}

interface LandingStatsProps {
  stats: Stat[];
}

const STAT_REPEAT_KEYS = ['first', 'second', 'third', 'fourth'] as const;

export const LandingStats = ({ stats }: LandingStatsProps) => (
  <div className='border-border bg-card/30 relative overflow-hidden border-y py-6'>
    <div className='flex whitespace-nowrap'>
      {STAT_REPEAT_KEYS.flatMap((repeatKey) =>
        stats.map((stat) => (
          <div key={`${repeatKey}-${stat.label}`} className='mx-12 flex items-center gap-3'>
            <span className='font-display text-foreground text-3xl font-bold md:text-4xl'>
              {stat.value}
            </span>
            <span className='text-muted-foreground text-sm tracking-wider uppercase md:text-base'>
              {stat.label}
            </span>
          </div>
        ))
      )}
    </div>
  </div>
);
