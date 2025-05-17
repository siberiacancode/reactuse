import { useTime } from '@siberiacancode/reactuse';

const Demo = () => {
  const { seconds, minutes, hours, meridiemHours, day, month, year } = useTime();

  return (
    <div>
      <p>
        Date{' '}
        <code>
          {String(month).padStart(2, '0')}/{String(day).padStart(2, '0')}/
          {String(year).padStart(2, '0')}
        </code>
      </p>
      <p>
        Time{' '}
        <code>
          {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
          {String(seconds).padStart(2, '0')}
        </code>
      </p>

      <p>
        Meridiem hours:{' '}
        <span>
          <code>
            {meridiemHours.value}
            {meridiemHours.type}
          </code>
        </span>
      </p>
    </div>
  );
};

export default Demo;
