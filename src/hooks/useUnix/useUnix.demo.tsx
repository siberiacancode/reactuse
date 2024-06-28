import React from 'react';
import { useUnix, TimeUnit, DateFormat } from '../hooks/useUnix/useUnix';

const UnixDemo: React.FC = () => {
  const {
    getUnixTime,
    formatUnixTime,
    addTime,
    subtractTime,
    compareUnixTimes,
    isLeapYear,
    getDaysInMonth,
    getWeekNumber,
    parseToUnixTime
  } = useUnix({ defaultFormat: 'ISO', defaultTimezone: 'UTC' });

  const unixTime = getUnixTime();
  const formattedTime = formatUnixTime(unixTime);
  const addedTime = addTime(unixTime, 'd', 5);
  const subtractedTime = subtractTime(unixTime, 'd', 5);
  const comparison = compareUnixTimes(unixTime, addedTime);
  const leapYear = isLeapYear(2024);
  const daysInMonth = getDaysInMonth(2024, 1);
  const weekNumber = getWeekNumber(new Date());
  const parsedTime = parseToUnixTime('2024-06-28T12:00:00Z', 'ISO');

  return (
    <div>
      <h1>Unix Time Demo</h1>
      <p>Current Unix Time: {unixTime}</p>
      <p>Formatted Unix Time: {formattedTime}</p>
      <p>Unix Time + 5 days: {addedTime}</p>
      <p>Unix Time - 5 days: {subtractedTime}</p>
      <p>Comparison of Unix Times: {comparison}</p>
      <p>Is 2024 a leap year? {leapYear ? 'Yes' : 'No'}</p>
      <p>Days in February 2024: {daysInMonth}</p>
      <p>Current Week Number: {weekNumber}</p>
      <p>Parsed Unix Time: {parsedTime}</p>
    </div>
  );
};

export default UnixDemo;
