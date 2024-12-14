import { usePostMessage } from '@/hooks';

const Demo = () => {
  const { postMessage } = usePostMessage<string>((event) => {
    if (location.origin === event.origin) {
      console.log('MessageEvent: ', event);
    }
  });

  const onClick = () => {
    postMessage(window, 'Custom Message', {
      targetOrigin: '*'
    });
  };

  return (
    <section>
      <button onClick={onClick}>Click to post message</button>
    </section>
  );
};

export default Demo;
