import { createContext, useField } from '@siberiacancode/reactuse';

const DEFAULT_PROFILE = { name: 'John Doe', age: 30 };
const profileContext = createContext(DEFAULT_PROFILE);

const App = () => {
  const name = profileContext.useSelect((state) => state.name);
  const age = profileContext.useSelect((state) => state.age);
  const profile = profileContext.useSelect();

  const nameField = useField({
    initialValue: DEFAULT_PROFILE.name
  });

  const ageField = useField({
    initialValue: DEFAULT_PROFILE.age
  });

  return (
    <div className='rounded-lg p-4'>
      <div className='mb-6'>
        <h3 className='font-semibold'>Current Profile:</h3>
        <div>
          <strong>Name:</strong> <span>{name}</span>
        </div>
        <div>
          <strong>Age:</strong> <span>{age}</span>
        </div>
      </div>

      <div className='mb-4'>
        <div className='mb-2'>
          <strong className='font-semibold'>Name:</strong>
          <input
            type='text'
            {...nameField.register()}
            onChange={(event) =>
              profile.set({
                ...profile.value!,
                name: event.target.value
              })
            }
          />
          {nameField.error && <span className='ml-2 text-sm text-red-500'>{nameField.error}</span>}
        </div>

        <div className='mb-2'>
          <strong className='font-semibold'>Age:</strong>
          <input
            type='number'
            {...ageField.register()}
            onChange={(event) =>
              profile.set({
                ...profile.value!,
                age: +event.target.value
              })
            }
          />
          {ageField.error && <span className='ml-2 text-sm text-red-500'>{ageField.error}</span>}
        </div>
      </div>

      <div className='flex gap-2'>
        <button
          className='rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600'
          onClick={() => {
            nameField.reset();
            ageField.reset();
            profile.set(DEFAULT_PROFILE);
          }}
        >
          Reset Form
        </button>
      </div>
    </div>
  );
};

const Demo = () => (
  <profileContext.Provider initialValue={DEFAULT_PROFILE}>
    <App />
  </profileContext.Provider>
);

export default Demo;
