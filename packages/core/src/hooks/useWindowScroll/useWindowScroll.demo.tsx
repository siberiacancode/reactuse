import { useWindowScroll } from './useWindowScroll';

const Demo = () => {
  const windowScroll = useWindowScroll();

  return (
    <div>
      <p>
        Scroll position x: <code>{Math.floor(windowScroll.value.x)}</code>, y:{' '}
        <code>{Math.floor(windowScroll.value.y)}</code>
      </p>
      <p>
        <button type='button' onClick={() => windowScroll.scrollTo({ y: 0 })}>
          Scroll to top
        </button>
      </p>
    </div>
  );
};

export default Demo;
