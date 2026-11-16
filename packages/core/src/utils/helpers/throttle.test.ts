import { throttle } from './throttle';

beforeEach(vi.useFakeTimers);
afterEach(vi.useRealTimers);

it('Should invoke the callback immediately', () => {
  const callback = vi.fn();
  const throttled = throttle(callback, 100);

  throttled('first');

  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith('first');
});

it('Should invoke a trailing call with the latest arguments', () => {
  const callback = vi.fn();
  const throttled = throttle(callback, 100);

  throttled('first');
  throttled('second');
  throttled('third');

  expect(callback).toHaveBeenCalledOnce();

  vi.advanceTimersByTime(100);

  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenLastCalledWith('third');
});

it('Should keep throttling while a trailing call is pending', () => {
  const callback = vi.fn();
  const throttled = throttle(callback, 100);

  throttled('first');
  throttled('second');
  vi.advanceTimersByTime(100);
  throttled('third');

  expect(callback).toHaveBeenCalledTimes(2);

  vi.advanceTimersByTime(100);

  expect(callback).toHaveBeenCalledTimes(3);
  expect(callback).toHaveBeenLastCalledWith('third');
});

it('Should start a new throttle window after an idle interval', () => {
  const callback = vi.fn();
  const throttled = throttle(callback, 100);

  throttled('first');
  vi.advanceTimersByTime(100);
  throttled('second');

  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenLastCalledWith('second');
});

it('Should preserve the call context for an immediate call', () => {
  const context = { value: 'context' };
  const values: string[] = [];
  const callback = function (this: typeof context) {
    values.push(this.value);
  };
  const throttled = throttle(callback, 100);

  throttled.call(context);

  expect(values).toStrictEqual(['context']);
});
