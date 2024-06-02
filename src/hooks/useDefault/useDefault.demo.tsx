import { useDefault } from './useDefault';

const Demo = () => {
  const initialUser = { name: 'Dima' };
  const defaultUser = { name: 'Danila' };
  const [user, setUser] = useDefault(initialUser, defaultUser);

  return (
    <div>
      <p>
        User: <code>{user.name}</code>
      </p>
      <input onChange={(event) => setUser({ name: event.target.value })} />
      <button type='button' onClick={() => setUser(null)}>
        Clear user
      </button>
    </div>
  );
};

export default Demo;
