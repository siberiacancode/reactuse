import { useValidatedState } from '@siberiacancode/reactuse';

const EMAIL_PATTERN = /^[\w .%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

const Demo = () => {
  const [email, setEmail] = useValidatedState('email@example.com', (value) =>
    EMAIL_PATTERN.test(value)
  );

  return (
    <section className='flex w-full max-w-md flex-col gap-5 p-4 sm:p-6'>
      <div className='flex items-start gap-3'>
        <span className='bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl'>
          @
        </span>

        <div className='flex min-w-0 flex-col gap-1'>
          <h2 className='text-foreground text-base font-semibold'>Enter your email</h2>
          <p className='text-muted-foreground text-sm'>
            Live validation keeps the last valid email available while you edit.
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <label className='text-foreground text-sm font-medium' htmlFor='validated-email'>
          Email address
        </label>

        <div className='relative'>
          <input
            aria-describedby='email-hint email-status'
            autoCapitalize='none'
            autoComplete='email'
            className='w-full rounded-lg py-2.5 pr-10 pl-9'
            id='validated-email'
            placeholder='email@example.com'
            spellCheck={false}
            type='email'
            value={email.value}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <p className='text-muted-foreground flex items-start gap-1.5 text-xs' id='email-hint'>
          Enter an address such as email@example.com
        </p>
      </div>

      <div
        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${
          email.valid
            ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
            : 'border-destructive/25 bg-destructive/10 text-destructive'
        }`}
        aria-live='polite'
        id='email-status'
      >
        <span>{email.valid ? 'Email address is valid' : 'Enter a valid email address'}</span>
      </div>

      <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
        <div className='bg-muted/50 flex min-w-0 flex-col gap-1 rounded-xl p-3'>
          <span className='text-muted-foreground text-xs font-medium'>Current value</span>
          <span className='text-foreground truncate font-mono text-sm'>{email.value ?? '—'}</span>
        </div>

        <div className='bg-muted/50 flex min-w-0 flex-col gap-1 rounded-xl p-3'>
          <span className='text-muted-foreground text-xs font-medium'>Last valid value</span>
          <span className='text-foreground block min-w-0 truncate font-mono text-sm'>
            {email.lastValidValue ?? <span className='text-muted-foreground'>—</span>}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Demo;
