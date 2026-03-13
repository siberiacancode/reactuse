import { createEventEmitter, useField } from '@siberiacancode/reactuse';

const DEFAULT_PROFILE = { name: 'John Doe', age: 30 };
const profileEmitter = createEventEmitter<{
  'profile:update': { name: string; age: number };
}>();

const NameFieldInfo = () => {
  const profileEventData = profileEmitter.useSubscribe('profile:update');

  return (
    <div>
      <strong>Name:</strong> <span>{profileEventData?.name ?? DEFAULT_PROFILE.name}</span>
    </div>
  );
};

const AgeFieldInfo = () => {
  const profileEventData = profileEmitter.useSubscribe('profile:update');

  return (
    <div>
      <strong>Age:</strong> <span>{profileEventData?.age ?? DEFAULT_PROFILE.age}</span>
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
    <div className='rounded-lg p-4'>
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
              profileEmitter.push('profile:update', {
                name: event.target.value,
                age: ageField.getValue() || DEFAULT_PROFILE.age
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
              profileEmitter.push('profile:update', {
                name: nameField.getValue() || DEFAULT_PROFILE.name,
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
            profileEmitter.push('profile:update', DEFAULT_PROFILE);
          }}
        >
          Reset Form
        </button>
      </div>
    </div>
  );
};

export default Demo;
