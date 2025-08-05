import { useObject } from './useObject';

const Demo = () => {
  const profileObject = useObject({
    name: 'Vladislav',
    age: '32',
    email: 'testmail@mail.com'
  });

  return (
    <div>
      <input
        type='text'
        value={profileObject.value.name}
        onChange={(event) => profileObject.set({ name: event.target.value })}
        placeholder='Name'
      />
      <input
        type='number'
        value={profileObject.value.age}
        onChange={(event) => profileObject.set({ age: event.target.value })}
        placeholder='Age'
      />

      <button onClick={profileObject.reset}>Reset</button>

      <button
        onClick={() =>
          profileObject.set({
            age: `${Number(profileObject.value.age) + 1}`
          })
        }
      >
        Update Age
      </button>
      <button onClick={() => profileObject.remove('email')}>Remove Email</button>

      <pre>
        <code>{JSON.stringify(profileObject.value, null, 2)}</code>
      </pre>
    </div>
  );
};

export default Demo;
