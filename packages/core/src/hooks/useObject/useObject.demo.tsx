import { useObject } from './useObject';

const Demo = () => {
  const { state, get, set, update, merge, remove, reset } = useObject({
    name: 'Vladislav',
    age: '32',
    email: 'testmail@mail.com'
  });

  return (
    <div className='flex items-start gap-4'>
      <div className=''>
        <input
          type='text'
          value={state.name}
          onChange={(event) => set('name', event.target.value)}
          placeholder='Name'
        />
        <input
          type='number'
          value={state.age}
          onChange={(event) => set('age', event.target.value)}
          placeholder='Age'
        />
        <input
          type='email'
          value={state.email}
          onChange={(event) => set('email', event.target.value)}
          placeholder='Email'
        />
        <div className=''>
          <button onClick={reset}>Reset</button>
          <button onClick={() => alert(get('email'))}>Get Email</button>
          <button onClick={() => update((prev) => ({ ...prev, age: '10' }))}>Update Age</button>
          <button onClick={() => merge({ name: 'Updated name', age: '10' })}>
            Merge Name and Age
          </button>
          <button onClick={() => remove('email')}>Remove Email</button>
        </div>
      </div>
      <pre>
        <code>{JSON.stringify(state, null, 2)}</code>
      </pre>
    </div>
  );
};

export default Demo;
