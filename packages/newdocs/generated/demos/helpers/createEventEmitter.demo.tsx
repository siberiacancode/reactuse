'use client'

import type { SubmitEvent } from 'react';

import { createEventEmitter, useDidUpdate } from '@siberiacancode/reactuse';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { memo, useRef } from 'react';

interface Profile {
  bio: string;
  email: string;
  isPublic: boolean;
  language: string;
  name: string;
  notifications: boolean;
}

const DEFAULT_PROFILE: Profile = {
  name: 'siberiacancode',
  email: 'hello@reactuse.org',
  bio: 'Building open-source React hooks',
  language: 'en',
  notifications: true,
  isPublic: false
};

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Russian' },
  { value: 'de', label: 'German' }
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;

interface ProfileEvents {
  'profile:bio': string;
  'profile:email': string;
  'profile:isPublic': boolean;
  'profile:language': string;
  'profile:name': string;
  'profile:notifications': boolean;
}

const profileEmitter = createEventEmitter<ProfileEvents>();
const profileSnapshot: Profile = { ...DEFAULT_PROFILE };

const getProfile = () => profileSnapshot;

const updateProfile = (partial: Partial<Profile>) => {
  Object.assign(profileSnapshot, partial);

  if (partial.name !== undefined) profileEmitter.push('profile:name', profileSnapshot.name);
  if (partial.email !== undefined) profileEmitter.push('profile:email', profileSnapshot.email);
  if (partial.bio !== undefined) profileEmitter.push('profile:bio', profileSnapshot.bio);
  if (partial.notifications !== undefined)
    profileEmitter.push('profile:notifications', profileSnapshot.notifications);
  if (partial.language !== undefined)
    profileEmitter.push('profile:language', profileSnapshot.language);
  if (partial.isPublic !== undefined)
    profileEmitter.push('profile:isPublic', profileSnapshot.isPublic);
};

interface RerenderInfoProps {
  componentName: string;
}

const RerenderInfo = ({ componentName }: RerenderInfoProps) => {
  const countRef = useRef(0);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useDidUpdate(() => {
    countRef.current++;
    if (badgeRef.current) {
      badgeRef.current.textContent = `${componentName} x${countRef.current}`;
      badgeRef.current.style.opacity = '1';
    }

    const timer = setTimeout(() => {
      if (badgeRef.current) badgeRef.current.style.opacity = '0';
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <span
      ref={badgeRef}
      className='bg-primary text-primary-foreground absolute -top-2.5 right-0 z-10 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold tabular-nums transition-opacity duration-300'
      style={{ opacity: 0 }}
    />
  );
};

const NameField = memo(() => {
  const name = profileEmitter.useSubscribe('profile:name') ?? getProfile().name;
  const error = name.trim().length < 2 ? 'At least 2 characters' : '';

  return (
    <div className='relative flex flex-col gap-1.5'>
      <RerenderInfo componentName='NameField' />
      <label className='text-foreground text-xs font-medium' htmlFor='name'>
        Display name
      </label>
      <input
        className='border-border bg-card text-foreground rounded-md border px-3 py-2 text-sm outline-none'
        id='name'
        placeholder='Your name'
        value={name}
        onChange={(event) => updateProfile({ name: event.target.value })}
      />
      {error && <span className='text-destructive text-xs'>{error}</span>}
    </div>
  );
});
NameField.displayName = 'NameField';

const EmailField = memo(() => {
  const email = profileEmitter.useSubscribe('profile:email') ?? getProfile().email;
  const error = !EMAIL_PATTERN.test(email) ? 'Invalid email format' : '';

  return (
    <div className='relative flex flex-col gap-1.5'>
      <RerenderInfo componentName='EmailField' />
      <label className='text-foreground text-xs font-medium' htmlFor='email'>
        Email
      </label>
      <input
        className='border-border bg-card text-foreground rounded-md border px-3 py-2 text-sm outline-none'
        id='email'
        placeholder='you@example.com'
        type='email'
        value={email}
        onChange={(event) => updateProfile({ email: event.target.value })}
      />
      {error && <span className='text-destructive text-xs'>{error}</span>}
    </div>
  );
});
EmailField.displayName = 'EmailField';

const BioField = memo(() => {
  const bio = profileEmitter.useSubscribe('profile:bio') ?? getProfile().bio;

  return (
    <div className='relative flex flex-col gap-1.5'>
      <RerenderInfo componentName='BioField' />
      <label className='text-foreground text-xs font-medium' htmlFor='bio'>
        Bio
      </label>
      <textarea
        className='border-border bg-card text-foreground min-h-[72px] resize-none rounded-md border px-3 py-2 text-sm outline-none'
        id='bio'
        placeholder='Tell something about yourself...'
        value={bio}
        onChange={(event) => updateProfile({ bio: event.target.value })}
      />
    </div>
  );
});
BioField.displayName = 'BioField';

const NotificationsField = memo(() => {
  const notifications =
    profileEmitter.useSubscribe('profile:notifications') ?? getProfile().notifications;

  return (
    <label className='relative flex cursor-pointer items-start justify-between gap-3'>
      <RerenderInfo componentName='NotificationsField' />
      <div className='flex flex-col gap-0.5'>
        <span className='text-foreground text-xs font-medium'>Email notifications</span>
        <span className='text-muted-foreground text-[11px]'>
          Receive product updates and release notes
        </span>
      </div>
      <input
        checked={notifications}
        role='switch'
        type='checkbox'
        onChange={(event) => updateProfile({ notifications: event.target.checked })}
      />
    </label>
  );
});
NotificationsField.displayName = 'NotificationsField';

const LanguageField = memo(() => {
  const language = profileEmitter.useSubscribe('profile:language') ?? getProfile().language;

  return (
    <div className='relative flex items-center justify-between gap-3'>
      <RerenderInfo componentName='LanguageField' />
      <div className='flex flex-col gap-0.5'>
        <label className='text-foreground text-xs font-medium' htmlFor='language'>
          Language
        </label>
        <span className='text-muted-foreground text-[11px]'>Choose your preferred language</span>
      </div>
      <div className='relative'>
        <select
          className='border-border bg-card text-foreground w-32 appearance-none rounded-md border py-1.5 pr-7 pl-3 text-xs outline-none'
          id='language'
          value={language}
          onChange={(event) => updateProfile({ language: event.target.value })}
        >
          {LANGUAGES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className='text-muted-foreground pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2' />
      </div>
    </div>
  );
});
LanguageField.displayName = 'LanguageField';

const PublicField = memo(() => {
  const isPublic = profileEmitter.useSubscribe('profile:isPublic') ?? getProfile().isPublic;

  return (
    <label className='relative flex cursor-pointer items-start gap-3'>
      <RerenderInfo componentName='PublicField' />
      <span className='mt-0.5 flex shrink-0 items-center'>
        <input
          checked={isPublic}
          className='peer sr-only'
          type='checkbox'
          onChange={(event) => updateProfile({ isPublic: event.target.checked })}
        />
        <span className='border-border peer-checked:border-foreground peer-checked:bg-foreground flex size-4 items-center justify-center rounded-[5px] border transition-colors'>
          {isPublic && <CheckIcon className='text-background size-3' strokeWidth={3.5} />}
        </span>
      </span>
      <div className='flex flex-col gap-0.5'>
        <span className='text-foreground text-xs font-medium'>Make profile public</span>
        <span className='text-muted-foreground text-[11px]'>
          Anyone on the internet can see your profile
        </span>
      </div>
    </label>
  );
});
PublicField.displayName = 'PublicField';

const Demo = () => {
  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => event.preventDefault();

  return (
    <section className='flex w-full max-w-md flex-col gap-4 p-4'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-foreground text-sm font-semibold'>Account settings</h2>
        <p className='text-muted-foreground text-xs'>
          Each field subscribes to its own event - only the changed field re-renders.
        </p>
      </div>

      <form className='flex flex-col gap-4' onSubmit={onSubmit}>
        <NameField />
        <EmailField />
        <BioField />
        <NotificationsField />
        <LanguageField />
        <PublicField />
      </form>
    </section>
  );
};

export default Demo;
