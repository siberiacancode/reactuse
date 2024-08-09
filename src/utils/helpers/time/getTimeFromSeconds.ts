export const getTimeFromSeconds = (timeInSeconds: number) => {
  const totalSeconds = Math.ceil(timeInSeconds);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days
  };
};
