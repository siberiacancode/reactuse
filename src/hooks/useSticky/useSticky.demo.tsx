import { useSticky } from './useSticky';

const Demo = () => {
  const { stuck, stickyRef } = useSticky<HTMLDivElement>({ axis: 'vertical' });

  return (
    <div>
      <div
        style={{
          height: '100px',
          width: '100px',
          backgroundColor: 'tomato',
        }}
      />
      <div
        style={{
          height: '100px',
          width: '100px',
          backgroundColor: 'tomato',
        }}
      />
      <div
        style={{
          height: '100px',
          width: '100px',
          backgroundColor: 'tomato',
        }}
      />
      <div
        ref={stickyRef}
        style={{
          height: '100px',
          width: '100px',
          backgroundColor: 'aliceblue',
          position: 'sticky',
          top: '70px',
          bottom: '20px'
        }}
      >
        {stuck ? "i'm stuck" : "i'm okay"}
      </div>
      <div
        style={{
          height: '100px',
          width: '100px',
          backgroundColor: 'tomato',
        }}
      />
      <div
        style={{
          height: '100px',
          width: '100px',
          backgroundColor: 'tomato',
        }}
      />
      <div
        style={{
          height: '100px',
          width: '100px',
          backgroundColor: 'tomato',
        }}
      />
      <div
        style={{
          height: '100px',
          width: '100px',
          backgroundColor: 'tomato',
        }}
      />
    </div>
  );
};

export default Demo;
