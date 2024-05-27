import { useClickOutside } from './useClickOutside';

const Demo = () => {
  const ref = useClickOutside<HTMLDivElement>((event) => {
    console.log('@click outside 1', event.target);
  });

  useClickOutside(
    () => document.getElementById('content')!,
    (event) => {
      console.log('@click outside 2', event.target);
    }
  );

  return (
    <div
      id='content'
      ref={ref}
      style={{
        width: 200,
        height: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid red'
      }}
    >
      content
    </div>
  );
};

export default Demo;
