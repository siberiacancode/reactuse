import { getDate } from './getDate';

afterEach(vi.useRealTimers);

it('Should return values for the current date', () => {
  const date = new Date(1999, 2, 12, 13, 14, 15);
  vi.useFakeTimers().setSystemTime(date);

  expect(getDate()).toStrictEqual({
    seconds: 15,
    minutes: 14,
    hours: 13,
    meridiemHours: { value: 1, type: 'pm' },
    day: 12,
    month: 3,
    year: 1999,
    timestamp: date.getTime()
  });
});

it('Should return values for a provided date', () => {
  const date = new Date(2024, 6, 21, 9, 8, 7);

  expect(getDate(date)).toStrictEqual({
    seconds: 7,
    minutes: 8,
    hours: 9,
    meridiemHours: { value: 9, type: 'am' },
    day: 21,
    month: 7,
    year: 2024,
    timestamp: date.getTime()
  });
});

it('Should return correct meridiem values at boundary hours', () => {
  const cases = [
    { hours: 0, expected: { value: 12, type: 'am' } },
    { hours: 11, expected: { value: 11, type: 'am' } },
    { hours: 12, expected: { value: 12, type: 'pm' } },
    { hours: 23, expected: { value: 11, type: 'pm' } }
  ] as const;

  cases.forEach(({ hours, expected }) => {
    expect(getDate(new Date(2024, 0, 1, hours)).meridiemHours).toStrictEqual(expected);
  });
});
