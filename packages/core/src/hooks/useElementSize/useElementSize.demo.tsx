import { useElementSize } from './useElementSize';

const Demo = () => {
  const elementSize = useElementSize<HTMLTextAreaElement>();

  return (
    <div className='flex flex-col gap-4'>
      <p>Resize the box to see changes</p>
      <textarea
        disabled
        ref={elementSize.ref}
        className='h-[200px] w-[200px]'
        style={{ resize: 'both' }}
        value={`width: ${Math.floor(elementSize.value.width)}\nheight: ${Math.floor(elementSize.value.height)}`}
      />
    </div>
  );
};

export default Demo;
