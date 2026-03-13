import { useSize } from '@siberiacancode/reactuse';

const Demo = () => {
  const size = useSize<HTMLTextAreaElement>();

  return (
    <div className='flex flex-col gap-4'>
      <p>Resize the box to see changes</p>
      <textarea
        disabled
        ref={size.ref}
        className='h-[200px] w-[200px]'
        style={{ resize: 'both' }}
        value={`width: ${Math.floor(size.value.width)}\nheight: ${Math.floor(size.value.height)}`}
      />
    </div>
  );
};

export default Demo;
