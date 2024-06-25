import { useOnline } from './useOnline';

const Demo = () => {
  const online = useOnline();

  return (
    <p>
      User is <code>{online ? 'online' : 'offline'}</code>
    </p>
  );
};

export default Demo;
