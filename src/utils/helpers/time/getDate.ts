export const getDate = (now: Date = new Date()) => {
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();
  const meridiemHours = hours % 12 === 0 ? 12 : hours % 12;
  const meridiemType = hours >= 12 ? 'pm' : 'am';
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const timestamp = now.getTime();

  return {
    seconds,
    minutes,
    hours,
    meridiemHours: { value: meridiemHours, type: meridiemType },
    day,
    month,
    year,
    timestamp
  };
};
