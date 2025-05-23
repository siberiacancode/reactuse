import { createStore, useField } from '@siberiacancode/reactuse';

const DEFAULT_PROFILE = { name: 'John Doe', age: 30 };
const profileStore = createStore(() => DEFAULT_PROFILE);

const NameFieldInfo = () => {
  const name = profileStore.use((state) => state.name);

  return (
    <div>
      <strong>Name:</strong> <span>{name}</span>
    </div>
  );
};

const AgeFieldInfo = () => {
  const age = profileStore.use((state) => state.age);

  return (
    <div>
      <strong>Age:</strong> <span>{age}</span>
    </div>
  );
};

const Demo = () => {
  const nameField = useField({
    initialValue: DEFAULT_PROFILE.name
  });

  const ageField = useField({
    initialValue: DEFAULT_PROFILE.age
  });

  return (
    <div className='rounded-lg p-4 shadow-md'>
      <div className='mb-6'>
        <h3 className='font-semibold'>Current Profile:</h3>
        <NameFieldInfo />
        <AgeFieldInfo />
      </div>

      <div className='mb-4'>
        <div className='mb-2'>
          <strong className='font-semibold'>Name:</strong>
          <input
            type='text'
            {...nameField.register()}
            onChange={(event) =>
              profileStore.set({
                ...profileStore.get(),
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
              profileStore.set({
                ...profileStore.get(),
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
            profileStore.set(DEFAULT_PROFILE);
          }}
        >
          Reset Form
        </button>
      </div>
    </div>
  );
};

export default Demo;
