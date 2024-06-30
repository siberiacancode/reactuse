import { getDate } from './getDate';

vi.useFakeTimers().setSystemTime(new Date('1999-03-12'));
const LOCAL_HOURS = new Date('1999-03-12').getHours();

it('Should return correct values for each property', () => {
  const result = getDate();

  expect(result.year).toBe(1999);
  expect(result.month).toBe(3);
  expect(result.day).toBe(12);
  expect(result.hours).toBe(LOCAL_HOURS);
  expect(result.minutes).toBe(0);
  expect(result.seconds).toBe(0);
  expect(result.meridiemHours.value).toBe(LOCAL_HOURS % 12 === 0 ? 12 : LOCAL_HOURS % 12);
  expect(result.meridiemHours.type).toBe(LOCAL_HOURS >= 12 ? 'pm' : 'am');
  expect(result.timestamp).toBe(921196800000);
});

it('Should return values by date param', () => {
  const date = new Date();
  const result = getDate(date);

  expect(result.year).toBe(date.getFullYear());
  expect(result.month).toBe(date.getMonth() + 1);
  expect(result.day).toBe(date.getDate());
  expect(result.hours).toBe(date.getHours());
  expect(result.minutes).toBe(date.getMinutes());
  expect(result.seconds).toBe(date.getSeconds());
  expect(result.meridiemHours.value).toBe(date.getHours());
  expect(result.meridiemHours.type).toBe(date.getHours() >= 12 ? 'pm' : 'am');
  expect(result.timestamp).toBe(date.getTime());
});

it('Should return correct meridiem hours', () => {
  expect(getDate(new Date('1999-03-12 23:00:00')).meridiemHours.value).toBe(11);
  expect(getDate(new Date('1999-03-12 23:00:00')).meridiemHours.type).toBe('pm');

  expect(getDate(new Date('1999-03-12 12:00:00')).meridiemHours.value).toBe(12);
  expect(getDate(new Date('1999-03-12 12:00:00')).meridiemHours.type).toBe('pm');

  expect(getDate(new Date('1999-03-12 11:00:00')).meridiemHours.value).toBe(11);
  expect(getDate(new Date('1999-03-12 11:00:00')).meridiemHours.type).toBe('am');

  expect(getDate(new Date('1999-03-12 00:00:00')).meridiemHours.value).toBe(12);
  expect(getDate(new Date('1999-03-12 00:00:00')).meridiemHours.type).toBe('am');
});
