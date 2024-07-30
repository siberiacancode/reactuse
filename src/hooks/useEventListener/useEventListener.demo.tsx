import { useEventListener } from './useEventListener';

const Demo = () => {
  const ref = useEventListener<HTMLDivElement>(
    'click',
    (event) => console.log('@click 1', event.target),
    {
      passive: true
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
