import { useField, useMap } from '@siberiacancode/reactuse';

const Demo = () => {
  const nameInput = useField();
  const ageInput = useField();

  const users = useMap([
    ['Dima', 25],
    ['Danila', 1]
  ]);

  return (
    <>
      <div className='flex gap-2'>
        <input placeholder='Name' {...nameInput.register()} />
        <input placeholder='Age' type='number' {...ageInput.register()} />

        <button
          type='button'
          onClick={() => {
            users.set(nameInput.getValue(), +ageInput.getValue());
            nameInput.reset();
            ageInput.reset();
          }}
        >
          Add
        </button>
      </div>

      <div className='mt-4 flex flex-col gap-2'>
        {Array.from(users.value, ([name, age], index) => (
          <div key={index}>
            {name}: <code>{age}</code>
          </div>
        ))}
      </div>
    </>
  );
};

export default Demo;
