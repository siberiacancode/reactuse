import { cn } from './cn';

it('Should merge string and number values', () => {
  expect(cn('root', 'active', 1)).toBe('root active 1');
});

it('Should ignore falsy values', () => {
  expect(cn('root', false, null, undefined, 0, '', Number.NaN)).toBe('root');
});

it('Should merge class names from object values', () => {
  expect(cn({ root: true, active: 1, hidden: 0, disabled: false })).toBe('root active');
});

it('Should merge nested arrays and objects', () => {
  expect(
    cn('root', ['card', ['active', { disabled: false, loading: true }], null], {
      visible: true
    })
  ).toBe('root card active loading visible');
});

it('Should return empty string when no values passed', () => {
  expect(cn()).toBe('');
});
