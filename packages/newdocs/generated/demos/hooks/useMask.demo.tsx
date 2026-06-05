'use client'

import { useField, useMask } from '@siberiacancode/reactuse';

import { cn } from '@/utils/lib';

interface Country {
  code: string;
  flag: string;
  mask: string;
  name: string;
}

const COUNTRIES = [
  { code: '7', name: 'Russia', flag: '🇷🇺', mask: '+9 (999) 999-99-99' },
  { code: '1', name: 'USA', flag: '🇺🇸', mask: '+9 (999) 999-9999' },
  { code: '44', name: 'UK', flag: '🇬🇧', mask: '+99 9999 999999' },
  { code: '77', name: 'Kazakhstan', flag: '🇰🇿', mask: '+99 (999) 999-99-99' },
  { code: '380', name: 'Ukraine', flag: '🇺🇦', mask: '+999 (99) 999-99-99' },
  { code: '998', name: 'Uzbekistan', flag: '🇺🇿', mask: '+999 (99) 999-99-99' }
] as const;

const DEFAULT_MASK = '999999999999999';
const INITIAL_DATE_VALUE = '05062026';

const SORTED_COUNTRIES = COUNTRIES.toSorted((a, b) => b.code.length - a.code.length);

const detectCountry = (rawValue: string): Country | undefined =>
  SORTED_COUNTRIES.find((country) => rawValue.startsWith(country.code));

const Demo = () => {
  const name = useField('');
  const cvv = useField('');

  const phoneMask = useMask({
    mask: DEFAULT_MASK,
    showMask: 'never',
    modify: (rawValue) => ({ mask: detectCountry(rawValue)?.mask ?? DEFAULT_MASK }),
    beforeMaskedChange: ({ nextState }) => ({
      ...nextState,
      selection: { start: nextState.value.length, end: nextState.value.length }
    })
  });

  const phone = phoneMask.watch();

  const cardNumber = useMask({
    mask: '9999 9999 9999 9999',
    showMask: 'never'
  });
  const expiry = useMask({ mask: '99/99', showMask: 'never' });
  const paymentDate = useMask({
    mask: '99/99/9999',
    showMask: 'never',
    initialValue: INITIAL_DATE_VALUE
  });

  const country = detectCountry(phone.rawValue);

  return (
    <section className='flex w-full max-w-md flex-col gap-4 p-4'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-foreground text-base font-semibold'>Checkout</h2>
        <p className='text-muted-foreground text-xs'>
          Enter your details to complete the payment of $49.00.
        </p>
      </div>

      <div className='flex flex-col gap-1.5'>
        <label className='text-foreground text-xs font-medium'>Full name</label>
        <input
          className='border-border bg-card text-foreground rounded-md border px-3 py-2 text-sm outline-none'
          placeholder='John Carter'
          {...name.register()}
        />
      </div>

      <div className='flex flex-col gap-1.5'>
        <label className='text-foreground text-xs font-medium'>Phone number</label>
        <div className='relative'>
          {country && (
            <span className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-base'>
              {country.flag}
            </span>
          )}
          <input
            className={cn(
              'border-border bg-card text-foreground w-full rounded-md border py-2 pr-3 text-sm outline-none',
              country ? 'pl-10!' : 'pl-3'
            )}
            inputMode='tel'
            placeholder='Start typing with country code'
            {...phoneMask.register()}
          />
        </div>
        {country && <span className='text-muted-foreground px-1 text-[10px]'>{country.name}</span>}
      </div>

      <div className='flex flex-col gap-3'>
        <label className='text-foreground text-xs font-medium'>Card details</label>

        <input
          className='border-border bg-card text-foreground rounded-md border px-3 py-2 font-mono text-sm tracking-wider outline-none'
          inputMode='numeric'
          placeholder='1234 5678 9012 3456'
          {...cardNumber.register()}
        />

        <div className='flex gap-2'>
          <input
            className='border-border bg-card text-foreground w-full rounded-md border px-3 py-2 font-mono text-sm outline-none'
            inputMode='numeric'
            placeholder='MM/YY'
            {...expiry.register()}
          />
          <input
            className='border-border bg-card text-foreground w-full rounded-md border px-3 py-2 font-mono text-sm outline-none'
            inputMode='numeric'
            placeholder='DD/MM/YYYY'
            {...paymentDate.register()}
          />
          <input
            className='border-border bg-card text-foreground w-full rounded-md border px-3 py-2 font-mono text-sm outline-none'
            inputMode='numeric'
            maxLength={3}
            placeholder='CVV'
            type='password'
            {...cvv.register()}
          />
        </div>

        <div className='flex items-center justify-end'>
          <button data-size='sm' type='button'>
            Pay $49.00
          </button>
        </div>
      </div>
    </section>
  );
};

export default Demo;
