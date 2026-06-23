import { cn } from './cn';

it('Should join plain strings', () => {
  expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
});

it('Should support conditional object syntax', () => {
  expect(cn('btn', { 'btn-active': true, 'btn-disabled': false })).toBe('btn btn-active');
});

it('Should support nested arrays', () => {
  expect(cn('btn', ['rounded', ['px-4', { shadow: true }]])).toBe('btn rounded px-4 shadow');
});

it('Should skip falsy values', () => {
  expect(cn('btn', null, undefined, false, '', 0)).toBe('btn');
});
