import { useTime } from './useTime';

const Demo = () => {
  const {
    seconds,
    minutes,
    hours,
    meridiemHours: { ampmHours, ampm },
    day,
    month,
    year
  } = useTime();

  return (
    <div>
      <p>Current Time</p>
      <div>
        <p>
          Seconds: <span>{seconds}</span>
        </p>
        <p>
          Minutes: <span>{minutes}</span>
        </p>
        <p>
          Hours: <span>{hours}</span>
        </p>
        <p>
          MeridiemHours:&nbsp;
          <span>
            {ampmHours}
            {ampm}
          </span>
        </p>
        <p>
          Day: <span>{day}</span>
        </p>
        <p>
          Month: <span>{month}</span>
        </p>
        <p>
          Year: <span>{year}</span>
        </p>
      </div>
    </div>
  );
};

export default Demo;
