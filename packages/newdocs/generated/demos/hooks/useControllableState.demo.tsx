'use client';

import type { ComponentProps } from 'react';

import { useControllableState } from '@siberiacancode/reactuse';
import { useState } from 'react';

interface SwitchProps extends Omit<ComponentProps<'input'>, 'onChange' | 'value'> {
  initialValue?: boolean;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

const Switch = ({ value, initialValue, onChange, ...props }: SwitchProps) => {
  const [checked, setChecked] = useControllableState({
    value,
    initialValue: initialValue ?? false,
    onChange
  });

  return (
    <input
      {...props}
      checked={checked ?? false}
      role='switch'
      type='checkbox'
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
};

interface Preferences {
  analytics: boolean;
  autoSave: boolean;
  darkMode: boolean;
  marketing: boolean;
  notifications: boolean;
}

const SETTINGS = [
  {
    key: 'notifications',
    label: 'Notifications',
    description: 'Get notified about important updates'
  },
  {
    key: 'darkMode',
    label: 'Dark mode',
    description: 'Use dark theme across the app'
  },
  {
    key: 'autoSave',
    label: 'Auto-save',
    description: 'Save changes automatically as you type'
  },
  {
    key: 'analytics',
    label: 'Analytics',
    description: 'Help us improve by sharing usage data'
  },
  {
    key: 'marketing',
    label: 'Marketing emails',
    description: 'Receive product news and offers'
  }
] as const;

const ALL_OFF = {
  notifications: false,
  darkMode: false,
  autoSave: false,
  analytics: false,
  marketing: false
} as const;

const ALL_ON: Preferences = {
  notifications: true,
  darkMode: true,
  autoSave: true,
  analytics: true,
  marketing: true
};

const RECOMMENDED: Preferences = {
  notifications: true,
  darkMode: true,
  autoSave: true,
  analytics: true,
  marketing: false
};

const Demo = () => {
  const [preferences, setPreferences] = useState<Preferences>(ALL_OFF);

  return (
    <section className='flex w-auto flex-col gap-6 md:min-w-md'>
      <div className='flex flex-col gap-2'>
        <h3>Preferences</h3>
        <p className='text-muted-foreground'>Manage how the app behaves.</p>
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <button data-variant='outline' type='button' onClick={() => setPreferences(ALL_ON)}>
          All on
        </button>
        <button data-variant='outline' type='button' onClick={() => setPreferences(ALL_OFF)}>
          All off
        </button>
        <button data-variant='outline' type='button' onClick={() => setPreferences(RECOMMENDED)}>
          Recommended
        </button>
      </div>

      <div className='flex flex-col'>
        {SETTINGS.map((setting) => (
          <div key={setting.key} className='items-top flex justify-between gap-4 py-3'>
            <div className='flex flex-col gap-1'>
              <label htmlFor={setting.key}>{setting.label}</label>
              <p className='text-muted-foreground text-xs'>{setting.description}</p>
            </div>

            <Switch
              id={setting.key}
              value={preferences[setting.key]}
              onChange={(value) =>
                setPreferences((current) => ({ ...current, [setting.key]: value }))
              }
            />
          </div>
        ))}

        <div className='border-border mt-2 border-t pt-2'>
          <div className='flex items-center justify-between gap-4 py-3'>
            <div className='flex flex-col gap-1'>
              <label htmlFor='beta'>Beta features</label>
              <p className='text-muted-foreground text-xs'>
                Independent toggle — managed inside the component
              </p>
            </div>

            <Switch id='beta' initialValue={false} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
