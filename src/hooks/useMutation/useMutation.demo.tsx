import React from 'react';

import { useMutation } from './useMutation';

const createUser = (name: string) => Promise.resolve({ name });

const Demo = () => {
  const [name, setName] = React.useState('');
  const [users, setUser] = React.useState([{ name: 'John' }]);

  const createUserMutation = useMutation(createUser);

  return (
    <>
      <p>User list</p>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button
        type='button'
        disabled={!name}
        onClick={async () => {
          const createUserResponse = await createUserMutation.mutateAsync(name);
          setUser([...users, createUserResponse]);
          setName('');
        }}
      >
        Create
      </button>

      <ul>
        {users.map((user) => (
          <li key={user.name}>{user.name}</li>
        ))}
      </ul>
    </>
  );
};

export default Demo;
