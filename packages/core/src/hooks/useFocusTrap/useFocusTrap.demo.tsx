import { useFocusTrap } from '@siberiacancode/reactuse';

const Demo = () => {
  const focusTrap = useFocusTrap<HTMLDivElement>(false);

  return (
    <div className='space-y-4'>
      <button className={'rounded px-4 py-2 text-white'} onClick={focusTrap.toggle}>
        {focusTrap.active ? 'Trap active' : 'Trap inactive'}
      </button>

      <div ref={focusTrap.ref} className='flex flex-col'>
        <input placeholder='First input' type='text' />
        <input placeholder='Second input' type='text' />
        <input placeholder='Third input' type='text' />
      </div>
    </div>
  );
};

export default Demo;
