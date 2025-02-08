import { useEventListener } from './useEventListener';

const Demo = () => {
  const ref = useEventListener<HTMLDivElement>(
    'click',
    (event) => console.log('@click', event.target),
    {
      passive: true
    }
  );

  return (
    <div
      ref={ref}
      style={{
        width: 200,
        height: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid red'
      }}
      id='content'
    >
      content
    </div>
  );
};

export default Demo;
