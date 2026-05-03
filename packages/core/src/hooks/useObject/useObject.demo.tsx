import { useObject } from '@siberiacancode/reactuse';

const Demo = () => {
  const profileObject = useObject({
    name: 'Vladislav',
    age: '32',
    email: 'testmail@mail.com'
  });

  return (
    <div>
      <input
        placeholder='Name'
        type='text'
        value={profileObject.value.name}
        onChange={(event) => profileObject.set({ name: event.target.value })}
      />
      <input
        placeholder='Age'
        type='number'
        value={profileObject.value.age}
        onChange={(event) => profileObject.set({ age: event.target.value })}
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
