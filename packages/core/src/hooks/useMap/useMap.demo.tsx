import { useField } from '../useField/useField';
import { useMap } from './useMap';

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
        <input type='number' placeholder='Age' {...ageInput.register()} />

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

      <div className='mt-4 flex gap-2 flex-col'>
        {Array.from(users.value).map(([name, age], index) => (
          <div key={index}>
            {name}: <code>{age}</code>
          </div>
        ))}
      </div>
    </>
  );
};

export default Demo;
