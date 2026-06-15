import { useDefault } from '@siberiacancode/reactuse';
import { ChevronDownIcon, RotateCcwIcon } from 'lucide-react';

interface ProjectSettings {
  framework: string;
  name: string;
  packageManager: string;
  styling: string;
}

const DEFAULT_SETTINGS: ProjectSettings = {
  name: 'my-awesome-app',
  framework: 'next',
  packageManager: 'npm',
  styling: 'tailwind'
};

const FRAMEWORKS = [
  { value: 'next', label: 'Next.js' },
  { value: 'vite', label: 'Vite' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' }
];

const PACKAGE_MANAGERS = [
  { value: 'npm', label: 'npm' },
  { value: 'pnpm', label: 'pnpm' },
  { value: 'yarn', label: 'yarn' },
  { value: 'bun', label: 'bun' }
];

const STYLING = [
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'css-modules', label: 'CSS Modules' },
  { value: 'styled', label: 'styled-components' },
  { value: 'vanilla', label: 'Vanilla CSS' }
];

const Demo = () => {
  const [settings, setSettings] = useDefault<ProjectSettings>(DEFAULT_SETTINGS, DEFAULT_SETTINGS);

  const update = (key: keyof ProjectSettings, value: string) =>
    setSettings({ ...settings, [key]: value });

  const isDefault =
    settings.name === DEFAULT_SETTINGS.name &&
    settings.framework === DEFAULT_SETTINGS.framework &&
    settings.packageManager === DEFAULT_SETTINGS.packageManager &&
    settings.styling === DEFAULT_SETTINGS.styling;

  return (
    <section className='flex w-full max-w-md flex-col gap-4 p-4'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <h3>Project settings</h3>
          <p className='text-muted-foreground text-sm'>Configure your project the way you like.</p>
        </div>

        <button
          aria-label='Reset to defaults'
          className='size-9! rounded-full! p-0!'
          data-size='icon'
          data-variant='outline'
          disabled={isDefault}
          type='button'
          onClick={() => setSettings(null)}
        >
          <RotateCcwIcon className='size-4' />
        </button>
      </div>

      <div className='flex flex-col divide-y rounded-xl border'>
        <div className='flex items-center justify-between gap-4 px-4 py-3'>
          <label className='text-sm font-medium' htmlFor='project-name'>
            Name
          </label>
          <input
            className='max-w-44'
            id='project-name'
            type='text'
            value={settings.name}
            onChange={(event) => update('name', event.target.value)}
          />
        </div>

        <div className='flex items-center justify-between gap-4 px-4 py-3'>
          <label className='text-sm font-medium' htmlFor='framework'>
            Framework
          </label>
          <div className='relative'>
            <select
              id='framework'
              value={settings.framework}
              onChange={(event) => update('framework', event.target.value)}
            >
              {FRAMEWORKS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className='text-muted-foreground pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2' />
          </div>
        </div>

        <div className='flex items-center justify-between gap-4 px-4 py-3'>
          <label className='text-sm font-medium' htmlFor='package-manager'>
            Package manager
          </label>
          <div className='relative'>
            <select
              id='package-manager'
              value={settings.packageManager}
              onChange={(event) => update('packageManager', event.target.value)}
            >
              {PACKAGE_MANAGERS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className='text-muted-foreground pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2' />
          </div>
        </div>

        <div className='flex items-center justify-between gap-4 px-4 py-3'>
          <label className='text-sm font-medium' htmlFor='styling'>
            Styling
          </label>
          <div className='relative'>
            <select
              id='styling'
              value={settings.styling}
              onChange={(event) => update('styling', event.target.value)}
            >
              {STYLING.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className='text-muted-foreground pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2' />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
