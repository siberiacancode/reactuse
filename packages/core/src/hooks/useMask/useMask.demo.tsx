import { useField, useMask } from '@siberiacancode/reactuse';
import { useEffect } from 'react';

const PREFIXES = ['+7', '+375', '+380', '+998'];

const Demo = () => {
  const prefixField = useField('+7');
  const prefix = prefixField.watch();
  const phoneMask = useMask({
    mask: `${prefix} (999) 999-99-99`
  });
  const hiddenMaskPhone = useMask({
    mask: `${prefix} (999) 999-99-99`,
    showMaskOnFocus: false,
    slotChar: null
  });

  useEffect(() => {
    phoneMask.set(phoneMask.rawValue);
    hiddenMaskPhone.set(hiddenMaskPhone.rawValue);
  }, [prefix]);

  return (
    <section className='flex w-full max-w-md flex-col gap-4 p-4'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-foreground text-sm font-semibold'>Phone mask variants</h2>
        <p className='text-muted-foreground text-xs'>
          Choose a prefix and compare a visible mask with a cleaner input variant.
        </p>
      </div>

      <div className='grid grid-cols-[120px_minmax(0,1fr)] gap-3'>
        <div className='flex flex-col gap-1.5'>
          <label className='text-foreground text-xs font-medium' htmlFor='prefix'>
            Prefix
          </label>
          <select
            className='border-border bg-card text-foreground rounded-md border px-3 py-2 text-sm outline-none'
            id='prefix'
            {...prefixField.register()}
          >
            {PREFIXES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className='border-border bg-card flex flex-col justify-center rounded-md border px-3 py-2'>
          <span className='text-foreground text-xs font-medium'>Variants</span>
          <span className='text-muted-foreground text-[11px]'>
            One input shows the mask, the second keeps it hidden until you type.
          </span>
        </div>
      </div>

      <div className='flex flex-col gap-1.5'>
        <label className='text-foreground text-xs font-medium' htmlFor='phone-with-mask'>
          Visible mask
        </label>
        <input
          ref={phoneMask.ref}
          className='border-border bg-card text-foreground rounded-md border px-3 py-2 text-sm outline-none'
          id='phone-with-mask'
          inputMode='tel'
          placeholder={`${prefix} (___) ___-__-__`}
        />
      </div>

      <div className='grid grid-cols-2 gap-3 text-xs'>
        <div className='border-border rounded-md border p-3'>
          <span className='text-muted-foreground block'>Masked value</span>
          <span className='text-foreground font-medium'>{phoneMask.value || 'Empty'}</span>
        </div>
        <div className='border-border rounded-md border p-3'>
          <span className='text-muted-foreground block'>Raw value</span>
          <span className='text-foreground font-medium'>{phoneMask.rawValue || 'Empty'}</span>
        </div>
      </div>

      <div className='flex flex-col gap-1.5'>
        <label className='text-foreground text-xs font-medium' htmlFor='phone-without-mask'>
          Hidden mask
        </label>
        <input
          ref={hiddenMaskPhone.ref}
          className='border-border bg-card text-foreground rounded-md border px-3 py-2 text-sm outline-none'
          id='phone-without-mask'
          inputMode='tel'
          placeholder='Enter phone number'
        />
        <span className='text-muted-foreground text-[11px]'>
          The formatting is applied while typing, but the empty mask is not shown.
        </span>
      </div>

      <div className='grid grid-cols-2 gap-3 text-xs'>
        <div className='border-border rounded-md border p-3'>
          <span className='text-muted-foreground block'>Masked value</span>
          <span className='text-foreground font-medium'>{hiddenMaskPhone.value || 'Empty'}</span>
        </div>
        <div className='border-border rounded-md border p-3'>
          <span className='text-muted-foreground block'>Raw value</span>
          <span className='text-foreground font-medium'>{hiddenMaskPhone.rawValue || 'Empty'}</span>
        </div>
      </div>

      <div className='flex items-center justify-between gap-3'>
        <span className='text-muted-foreground text-xs'>
          {phoneMask.isComplete && hiddenMaskPhone.isComplete
            ? 'Both masks are complete'
            : 'Enter 10 digits'}
        </span>
        <button
          type='button'
          onClick={() => {
            phoneMask.reset();
            hiddenMaskPhone.reset();
          }}
        >
          Reset
        </button>
      </div>
    </section>
  );
};

export default Demo;
