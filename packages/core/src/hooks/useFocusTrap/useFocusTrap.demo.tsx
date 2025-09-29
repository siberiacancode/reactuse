import { useFocusTrap } from '@siberiacancode/reactuse';

const Demo = () => {
  const focusTrap = useFocusTrap<HTMLDivElement>(false);

  return (
    <div className='space-y-4'>
      <button className={'rounded px-4 py-2 text-white'} onClick={focusTrap.toggle}>
        {focusTrap.active ? 'Trap active' : 'Trap inactive'}
      </button>

      <div ref={focusTrap.ref} className='flex flex-col'>
        <input type='text' placeholder='First input' />
        <input type='text' placeholder='Second input' />
        <input type='text' placeholder='Third input' />
      </div>
    </div>
  );
};

export default Demo;
