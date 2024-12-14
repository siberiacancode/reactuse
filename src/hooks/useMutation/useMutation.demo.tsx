import { useField } from '../useField/useField';
import { useList } from '../useList/useList';
import { useMutation } from './useMutation';

const createUser = (name: string) => Promise.resolve({ name });

const Demo = () => {
  const nameField = useField({ initialValue: '' });
  const userList = useList([{ name: 'John' }]);

  const createUserMutation = useMutation(createUser);

  const name = nameField.watch();

  return (
    <>
      <p>User list</p>
      <input {...nameField.register()} />
      <button
        disabled={!name}
        type='button'
        onClick={async () => {
          const createUserResponse = await createUserMutation.mutateAsync(name);
          userList.push(createUserResponse);
          nameField.setValue('');
        }}
      >
        Create
      </button>

      <ul>
        {userList.value.map((user) => (
          <li key={user.name}>{user.name}</li>
        ))}
      </ul>
    </>
  );
};

export default Demo;
