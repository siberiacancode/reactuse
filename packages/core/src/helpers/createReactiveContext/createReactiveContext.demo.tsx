import { createReactiveContext, useDidUpdate, useEvent } from '@siberiacancode/reactuse';
import { memo, useRef, useState } from 'react';

interface Profile {
  age: number;
  name: string;
}

const DEFAULT_PROFILE = { name: 'John Doe', age: 30 };
const { Provider, useSelector } = createReactiveContext<{
  profile: Profile;
  set: (profile: Partial<Profile>) => void;
}>({ profile: DEFAULT_PROFILE, set: () => {} });

const RerenderInfo = ({ componentName }: { componentName: string }) => {
  const showRef = useRef(false);
  const countRef = useRef(1);
  const codeRef = useRef<HTMLModElement>(null);

  useDidUpdate(() => {
    countRef.current++;
    showRef.current = true;
    codeRef.current!.classList.remove('hidden');

    const timer = setTimeout(() => {
      codeRef.current!.classList.add('hidden');
      countRef.current = 0;
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <code ref={codeRef} className='absolute right-0 top-0 hidden rounded px-2 text-xs text-white'>
      {componentName} x{countRef.current}
    </code>
  );
};

const NameFieldInfo = memo(() => {
  const name = useSelector((state) => state.profile.name);

  return (
    <div className='relative'>
      <strong>Name:</strong> <span>{name}</span>
      <RerenderInfo componentName='NameFieldInfo' />
    </div>
  );
});
NameFieldInfo.displayName = 'NameFieldInfo';

const AgeFieldInfo = memo(() => {
  const age = useSelector((state) => state.profile.age);
  return (
    <div className='relative'>
      <strong>Age:</strong> <span>{age}</span>
      <RerenderInfo componentName='AgeFieldInfo' />
    </div>
  );
});
AgeFieldInfo.displayName = 'AgeFieldInfo';

const NameField = memo(() => {
  const name = useSelector((state) => state.profile.name);
  const setProfile = useSelector((state) => state.set);

  return (
    <div className='relative mb-2'>
      <strong className='font-semibold'>Name:</strong>
      <input
        type='text'
        value={name}
        onChange={(event) =>
          setProfile({
            name: event.target.value
          })
        }
      />
      <RerenderInfo componentName='NameField' />
    </div>
  );
});
NameField.displayName = 'NameField';

const AgeField = memo(() => {
  const age = useSelector((state) => state.profile.age);
  const setProfile = useSelector((state) => state.set);

  return (
    <div className='relative mb-2'>
      <strong className='font-semibold'>Age:</strong>
      <input
        type='number'
        value={age}
        onChange={(event) =>
          setProfile({
            age: +event.target.value
          })
        }
      />
      <RerenderInfo componentName='AgeField' />
    </div>
  );
});
AgeField.displayName = 'AgeField';

const ResetButton = memo(() => {
  const setProfile = useSelector((state) => state.set);

  return (
    <div className='relative flex gap-2'>
      <button
        className='rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600'
        onClick={() => setProfile(DEFAULT_PROFILE)}
      >
        Reset Form
      </button>
      <RerenderInfo componentName='ResetButton' />
    </div>
  );
});
ResetButton.displayName = 'ResetButton';

const Demo = () => (
  <div className='p-4'>
    <div className='mb-6'>
      <h3 className='font-semibold'>Current Profile:</h3>
      <NameFieldInfo />
      <AgeFieldInfo />
    </div>

    <div className='mb-4'>
      <NameField />
      <AgeField />
    </div>

    <ResetButton />
  </div>
);

const App = () => {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const set = useEvent((updatedProfile: Partial<Profile>) =>
    setProfile({ ...profile, ...updatedProfile })
  );

  return (
    <Provider value={{ profile, set }}>
      <Demo />
    </Provider>
  );
};

export default App;
