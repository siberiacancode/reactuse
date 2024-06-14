export const getDate = () => {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();
  const ampmHours = hours % 12 === 0 ? 12 : hours % 12;
  const ampm = hours >= 12 ? 'pm' : 'am';
  const day = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();
  return { seconds, minutes, hours, meridiemHours: { ampmHours, ampm }, day, month, year };
};
