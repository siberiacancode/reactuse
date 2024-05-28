import { useOnline } from './useOnline';

const Demo = () => {
  const online = useOnline();

  return <p>User is {online ? 'online' : 'offline'}</p>;
};

export default Demo;
