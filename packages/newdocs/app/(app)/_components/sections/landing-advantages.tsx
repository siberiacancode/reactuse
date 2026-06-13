interface LandingAdvantagesProps {
  contributorsCount: string;
  hooksCount: string;
}

const getAdvantages = ({ contributorsCount, hooksCount }: LandingAdvantagesProps) => [
  {
    description:
      'Minimal footprint with zero dependencies. Each hook is optimized for maximum performance.',
    number: '01',
    title: 'Lightweight'
  },
  {
    description: 'Unified patterns across all hooks for predictable, maintainable code.',
    number: '02',
    title: 'Consistent API'
  },
  {
    description: 'Install via CLI or copy directly. Configure hooks to fit your exact needs.',
    number: '03',
    title: 'Customizable'
  },
  {
    description: 'From state management to browser APIs, sensors, elements, and utilities.',
    number: '04',
    title: `${hooksCount} Hooks`
  },
  {
    description: 'Import only what you need. Unused hooks are excluded from your bundle.',
    number: '05',
    title: 'Tree Shakeable'
  },
  {
    description: `${contributorsCount} contributors, actively maintained with regular updates and new hooks.`,
    number: '06',
    title: 'Community Driven'
  }
];

export const LandingAdvantages = (props: LandingAdvantagesProps) => {
  const advantages = getAdvantages(props);

  return (
    <section className='border-border border-t'>
      <div className='container mx-auto px-6 py-12 md:py-24'>
        <h2 className='font-display text-foreground text-4xl font-bold tracking-tight uppercase md:text-8xl'>
          Why reactuse?
        </h2>

        <div className='mt-12 flex flex-col'>
          {advantages.map((advantage) => (
            <div
              key={advantage.title}
              className='group border-border hover:border-foreground/20 flex items-start gap-6 border-b py-6 transition-colors last:border-0 md:gap-8'
            >
              <span className='font-display text-muted-foreground/40 group-hover:text-foreground pt-1 text-3xl leading-none tabular-nums transition-colors md:text-4xl'>
                {advantage.number}
              </span>
              <div className='flex-1'>
                <h3 className='text-foreground text-2xl font-semibold tracking-tight md:text-3xl'>
                  {advantage.title}
                </h3>
                <p className='text-muted-foreground mt-2 max-w-2xl text-base leading-relaxed md:text-lg'>
                  {advantage.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
