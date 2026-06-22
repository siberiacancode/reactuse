import type { SubmitEvent } from 'react';

import { createContext, useField } from '@siberiacancode/reactuse';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { memo } from 'react';

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

const profileContext = createContext<Profile>(DEFAULT_PROFILE);

const NameField = memo(() => {
  const profile = profileContext.useSelect();
  const nameField = useField(DEFAULT_PROFILE.name, { validateOnBlur: true });

  return (
    <div className='flex flex-col gap-1.5'>
      <label className='text-foreground text-xs font-medium' htmlFor='name'>
        Display name
      </label>
      <input
        className='border-border bg-card text-foreground rounded-md border px-3 py-2 text-sm outline-none'
        id='name'
        placeholder='Your name'
        {...nameField.register({
          required: 'Name is required',
          minLength: { value: 2, message: 'At least 2 characters' }
        })}
        onChange={(event) => {
          nameField.register().onChange(event);
          profile.set({ ...(profile.value as Profile), name: event.target.value });
        }}
      />
      {nameField.error && <span className='text-destructive text-xs'>{nameField.error}</span>}
    </div>
  );
});
NameField.displayName = 'NameField';

const EmailField = memo(() => {
  const profile = profileContext.useSelect();
  const emailField = useField(DEFAULT_PROFILE.email, { validateOnBlur: true });

  return (
    <div className='flex flex-col gap-1.5'>
      <label className='text-foreground text-xs font-medium' htmlFor='email'>
        Email
      </label>
      <input
        className='border-border bg-card text-foreground rounded-md border px-3 py-2 text-sm outline-none'
        id='email'
        placeholder='you@example.com'
        type='email'
        {...emailField.register({
          required: 'Email is required',
          pattern: { value: EMAIL_PATTERN, message: 'Invalid email format' }
        })}
        onChange={(event) => {
          emailField.register().onChange(event);
          profile.set({ ...(profile.value as Profile), email: event.target.value });
        }}
      />
      {emailField.error && <span className='text-destructive text-xs'>{emailField.error}</span>}
    </div>
  );
});
EmailField.displayName = 'EmailField';

const BioField = memo(() => {
  const profile = profileContext.useSelect();
  const bioField = useField(DEFAULT_PROFILE.bio);

  return (
    <div className='flex flex-col gap-1.5'>
      <label className='text-foreground text-xs font-medium' htmlFor='bio'>
        Bio
      </label>
      <textarea
        className='border-border bg-card text-foreground min-h-[72px] resize-none rounded-md border px-3 py-2 text-sm outline-none'
        id='bio'
        placeholder='Tell something about yourself...'
        {...bioField.register()}
        onChange={(event) => {
          bioField.register().onChange(event);
          profile.set({ ...(profile.value as Profile), bio: event.target.value });
        }}
      />
    </div>
  );
});
BioField.displayName = 'BioField';

const NotificationsField = memo(() => {
  const profile = profileContext.useSelect();
  const notificationsField = useField(DEFAULT_PROFILE.notifications);

  return (
    <label className='flex cursor-pointer items-start justify-between gap-3'>
      <div className='flex flex-col gap-0.5'>
        <span className='text-foreground text-xs font-medium'>Email notifications</span>
        <span className='text-muted-foreground text-[11px]'>
          Receive product updates and release notes
        </span>
      </div>
      <input
        role='switch'
        type='checkbox'
        {...notificationsField.register()}
        onChange={(event) => {
          notificationsField.register().onChange(event);
          profile.set({ ...(profile.value as Profile), notifications: event.target.checked });
        }}
      />
    </label>
  );
});
NotificationsField.displayName = 'NotificationsField';

const LanguageField = memo(() => {
  const profile = profileContext.useSelect();
  const languageField = useField(DEFAULT_PROFILE.language);

  return (
    <div className='flex items-center justify-between gap-3'>
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
          {...languageField.register()}
          onChange={(event) => {
            languageField.register().onChange(event);
            profile.set({ ...(profile.value as Profile), language: event.target.value });
          }}
        >
          {LANGUAGES.map((language) => (
            <option key={language.value} value={language.value}>
              {language.label}
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
  const profile = profileContext.useSelect();
  const publicField = useField(DEFAULT_PROFILE.isPublic);
  const isPublic = publicField.watch();

  return (
    <label className='flex cursor-pointer items-start gap-3'>
      <span className='mt-0.5 flex shrink-0 items-center'>
        <input
          className='peer sr-only'
          type='checkbox'
          {...publicField.register()}
          onChange={(event) => {
            publicField.register().onChange(event);
            profile.set({ ...(profile.value as Profile), isPublic: event.target.checked });
          }}
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

const ProfileForm = () => {
  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form className='flex flex-col gap-4' onSubmit={onSubmit}>
      <NameField />
      <EmailField />
      <BioField />

      <div className='border-border flex flex-col gap-3 border-t pt-4'>
        <NotificationsField />
        <LanguageField />
      </div>

      <PublicField />

      <div className='flex justify-end'>
        <button type='submit'>Save changes</button>
      </div>
    </form>
  );
};

const Demo = () => (
  <profileContext.Provider initialValue={DEFAULT_PROFILE}>
    <section className='flex w-full max-w-md flex-col gap-3 p-4'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-foreground text-sm font-semibold'>Account settings</h2>
        <p className='text-muted-foreground text-xs'>Update your public profile and preferences.</p>
      </div>

      <ProfileForm />
    </section>
  </profileContext.Provider>
);

export default Demo;
