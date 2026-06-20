import { useTime } from '@siberiacancode/reactuse';

const Digit = ({ value }: { value: string }) => (
  <span className='relative inline-flex h-14 w-9 overflow-hidden'>
    <span
      key={value}
      className='animate-in slide-in-from-bottom-full text-foreground absolute inset-0 flex items-center justify-center font-mono text-5xl font-bold tabular-nums duration-300'
    >
      {value}
    </span>
  </span>
);

const Demo = () => {
  const { hours, minutes, seconds, meridiemHours, day, month, year } = useTime();

  const format = (value: number) => String(value).padStart(2, '0');

  const hh = format(hours);
  const mm = format(minutes);
  const ss = format(seconds);

  const date = new Date(year, month - 1, day);
  const fullDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);

  return (
    <section className='flex flex-col items-center gap-4 p-8'>
      <div className='flex items-center'>
        <Digit value={hh[0]} />
        <Digit value={hh[1]} />
        <span className='text-foreground font-mono text-5xl font-bold'>:</span>
        <Digit value={mm[0]} />
        <Digit value={mm[1]} />
        <span className='text-foreground font-mono text-5xl font-bold'>:</span>
        <Digit value={ss[0]} />
        <Digit value={ss[1]} />
        <span className='text-muted-foreground ml-2 self-end pb-2 text-sm font-medium'>
          {meridiemHours.type}
        </span>
      </div>

      <div className='text-muted-foreground text-sm'>{fullDate}</div>
    </section>
  );
};

export default Demo;
