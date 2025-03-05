import { useKeysPressed } from './useKeysPressed';

const Demo = () => {
  const keysPressed = useKeysPressed();

  return (
    <div>
      <span>Currently pressed keys:</span>
      <div className='flex flex-wrap gap-2'>
        {keysPressed.value.map(({ key }) => (
          <code key={key}>{key}</code>
        ))}
      </div>
    </div>
  );
};

export default Demo;
