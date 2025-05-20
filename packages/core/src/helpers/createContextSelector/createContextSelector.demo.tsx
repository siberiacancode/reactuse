import { createContextSelector, useRenderCount } from '@siberiacancode/reactuse';
import { memo, useCallback, useMemo, useState } from 'react';

interface ProfileData {
  updateAvatar: (avatar: string) => void;
  updateEmail: (email: string) => void;
  updateName: (name: string) => void;
  updateStatus: (isActive: boolean) => void;
  profile: {
    name: string;
    email: string;
    avatar: string;
    isActive: boolean;
  };
}

const defaultProfile: ProfileData = {
  profile: {
    name: 'Ivan Ivanov',
    email: 'user@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    isActive: true
  },
  updateName: () => {},
  updateEmail: () => {},
  updateAvatar: () => {},
  updateStatus: () => {}
};

const { Provider, useSelector } = createContextSelector<ProfileData>(defaultProfile);

const NameForm = memo(() => {
  const value = useSelector((state) => state.profile.name);
  const onChange = useSelector((state) => state.updateName);
  const renderCount = useRenderCount();

  return (
    <div className='mb-4'>
      <label className='mb-1 block text-sm font-medium text-gray-700' htmlFor='name'>
        Name:
      </label>
      <input
        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500'
        id='name'
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className='mt-1 inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-600'>
        Rerenders: {renderCount}
      </div>
    </div>
  );
});
NameForm.displayName = 'NameForm';

const EmailForm = memo(() => {
  const value = useSelector((state) => state.profile.email);
  const onChange = useSelector((state) => state.updateEmail);
  const renderCount = useRenderCount();

  return (
    <div className='mb-4'>
      <label className='mb-1 block text-sm font-medium text-gray-700' htmlFor='email'>
        Email:
      </label>
      <input
        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500'
        id='email'
        type='email'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className='mt-1 inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-600'>
        Rerenders: {renderCount}
      </div>
    </div>
  );
});
EmailForm.displayName = 'EmailForm';

const AvatarForm = memo(() => {
  const value = useSelector((state) => state.profile.avatar);
  const onChange = useSelector((state) => state.updateAvatar);
  const renderCount = useRenderCount();

  const avatars = useMemo(
    () => [
      'https://i.pravatar.cc/150?img=1',
      'https://i.pravatar.cc/150?img=2',
      'https://i.pravatar.cc/150?img=3',
      'https://i.pravatar.cc/150?img=4'
    ],
    []
  );

  return (
    <div className='mb-4'>
      <label className='mb-2 block text-sm font-medium text-gray-700'>Choose avatar:</label>
      <div className='flex space-x-2'>
        {avatars.map((avatar) => (
          <img
            key={avatar}
            className={`h-12 w-12 cursor-pointer rounded-full transition-all ${
              value === avatar
                ? 'ring-2 ring-indigo-500 ring-offset-2'
                : 'opacity-70 hover:opacity-100'
            }`}
            alt='Avatar variant'
            src={avatar}
            onClick={() => onChange(avatar)}
          />
        ))}
      </div>
      <div className='mt-1 inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-600'>
        Rerenders: {renderCount}
      </div>
    </div>
  );
});
AvatarForm.displayName = 'AvatarForm';

const StatusForm = memo(() => {
  const value = useSelector((state) => state.profile.isActive);
  const onChange = useSelector((state) => state.updateStatus);
  const renderCount = useRenderCount();

  return (
    <div className='mb-4'>
      <div className='flex items-center'>
        <button
          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
            value ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
          type='button'
          onClick={() => onChange(!value)}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              value ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className='ml-3 text-sm text-gray-700'>{value ? 'Active' : 'Inactive'}</span>
      </div>
      <div className='mt-1 inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-600'>
        Rerenders: {renderCount}
      </div>
    </div>
  );
});
StatusForm.displayName = 'StatusForm';

const App = () => {
  const [profile, setProfile] = useState<ProfileData['profile']>(defaultProfile.profile);

  const updateName = useCallback((name: string) => {
    setProfile((prev) => ({ ...prev, name }));
  }, []);

  const updateEmail = useCallback((email: string) => {
    setProfile((prev) => ({ ...prev, email }));
  }, []);

  const updateAvatar = useCallback((avatar: string) => {
    setProfile((prev) => ({ ...prev, avatar }));
  }, []);

  const updateStatus = useCallback((isActive: boolean) => {
    setProfile((prev) => ({ ...prev, isActive }));
  }, []);

  // you don't have to use useMemo
  return (
    <Provider
      // eslint-disable-next-line react/no-unstable-context-value
      value={{
        profile,
        updateName,
        updateEmail,
        updateAvatar,
        updateStatus
      }}
    >
      <div className='min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <div className='overflow-hidden rounded-lg bg-white p-6 shadow'>
              <h2 className='mb-6 text-xl font-semibold text-gray-900'>Edit profile</h2>
              <AvatarForm />
              <NameForm />
              <EmailForm />
              <StatusForm />
            </div>
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default App;
