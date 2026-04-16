import { cn } from '@siberiacancode/docs/utils';
import { useToggle } from '@siberiacancode/reactuse';

const Demo = () => {
  const [value, toggle] = useToggle(['blue', 'orange', 'black', 'teal', 'purple'] as const);

  return (
    <button
      className={cn({
        'bg-blue-500! dark:bg-blue-300!': value === 'blue',
        'bg-orange-500! dark:bg-orange-300!': value === 'orange',
        'bg-black/50!': value === 'black',
        'bg-teal-500! dark:bg-teal-300!': value === 'teal',
        'bg-purple-500! dark:bg-purple-300!': value === 'purple'
      })}
      type='button'
      onClick={() => toggle()}
    >
      {value}
    </button>
  );
};

export default Demo;
