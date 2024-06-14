import { useTime } from './useTime';

const Demo = () => {
  const { seconds, minutes, hours, meridiemHours, day, month, year } = useTime();

  return (
    <div>
      <p>
        Date{' '}
        <code>
          {month}:{day}:{year}
        </code>
      </p>
      <p>
        Time{' '}
        <code>
          {hours}:{minutes}:{seconds}
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
