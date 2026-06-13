'use client';

import type { ReactNode, SubmitEvent } from 'react';

import {
  useBoolean,
  useClickOutside,
  useCopy,
  useCounter,
  useCssVar,
  useDisclosure,
  useDropZone,
  useField,
  useFileDialog,
  useLongPress,
  useMask,
  useMeasure,
  useMergedRef,
  useOffsetPagination,
  useOnline,
  usePreferredColorScheme,
  useQuery
} from '@siberiacancode/reactuse';
import {
  ArrowRight,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  CreditCardIcon,
  EyeIcon,
  EyeOffIcon,
  ImageIcon,
  Loader2Icon,
  LogOutIcon,
  MinusIcon,
  MonitorIcon,
  MoonIcon,
  PlusIcon,
  SettingsIcon,
  SunIcon,
  UploadCloudIcon,
  UserIcon,
  XIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRef, useState } from 'react';

import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsList,
  TabsTrigger,
  Textarea
} from '@/src/components/ui';
import { cn } from '@/utils/lib';

const Cell = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('bg-card flex items-center justify-center rounded-2xl p-6', className)}>
    {children}
  </div>
);

/* ── useCounter ── */

const getGuestLabel = (count: number) => {
  if (count === 1) return 'Just you';
  if (count === 2) return 'For two';
  if (count <= 4) return 'Small group';
  if (count <= 7) return 'Medium group';
  return 'Large party';
};

const CounterDemo = () => {
  const counter = useCounter(2, { min: 1, max: 10 });

  return (
    <div className='flex flex-col items-center gap-3'>
      <span className='text-muted-foreground text-sm font-medium tracking-widest'>GUESTS</span>
      <div className='flex items-center gap-6'>
        <Button
          className={cn('rounded-full', counter.value <= 1 && 'opacity-25')}
          size='icon-lg'
          variant='ghost'
          onClick={() => counter.dec()}
        >
          <MinusIcon strokeWidth={1.5} />
        </Button>
        <span className='w-24 text-center text-7xl font-light tabular-nums'>{counter.value}</span>
        <Button
          className={cn('rounded-full', counter.value >= 10 && 'opacity-25')}
          size='icon-lg'
          variant='ghost'
          onClick={() => counter.inc()}
        >
          <PlusIcon strokeWidth={1.5} />
        </Button>
      </div>
      <span className='text-muted-foreground text-sm'>{getGuestLabel(counter.value)}</span>
    </div>
  );
};

/* ── useBoolean ── */

const BooleanDemo = () => {
  const [visible, toggle] = useBoolean();

  return (
    <div className='flex w-full flex-col gap-4'>
      <p className='text-foreground text-sm'>Toggle password visibility</p>
      <div className='relative'>
        <Input className='pr-10' defaultValue='reactuse2026' type={visible ? 'text' : 'password'} />
        <Button
          aria-label={visible ? 'Hide password' : 'Show password'}
          className='absolute top-1/2 right-1 -translate-y-1/2 rounded-full'
          size='icon-lg'
          variant='ghost'
          onClick={() => toggle()}
        >
          {visible ? <EyeOffIcon className='size-4' /> : <EyeIcon className='size-4' />}
        </Button>
      </div>
      <p className='text-muted-foreground text-xs'>
        The current state is <code>{visible ? 'shown' : 'hidden'}</code>
      </p>
    </div>
  );
};

/* ── useOnline ── */

const OnlineDemo = () => {
  const online = useOnline();

  return (
    <span className='border-border bg-card text-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium'>
      <span
        className={cn('size-2 rounded-full', online ? 'bg-foreground' : 'bg-muted-foreground')}
      />
      {online ? 'Online' : 'Offline'}
    </span>
  );
};

/* ── usePreferredColorScheme ── */

const ColorSchemeDemo = () => {
  const scheme = usePreferredColorScheme();

  return (
    <div className='flex flex-col items-center gap-3'>
      <div className='bg-muted text-foreground flex size-12 items-center justify-center rounded-full'>
        {scheme === 'light' && <SunIcon className='size-5' />}
        {scheme === 'dark' && <MoonIcon className='size-5' />}
        {scheme === 'no-preference' && <MonitorIcon className='size-5' />}
      </div>
      <div className='flex flex-col items-center gap-1 text-center'>
        <p className='text-foreground text-sm font-medium'>
          {scheme === 'light' && 'Light mode is on'}
          {scheme === 'dark' && 'Dark mode is on'}
          {scheme === 'no-preference' && 'No theme set'}
        </p>
        <p className='text-muted-foreground text-xs'>Detected from your system settings</p>
      </div>
    </div>
  );
};

/* ── useClickOutside → shadcn DropdownMenu ── */

const DropdownDemo = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        className='border-border bg-card hover:bg-accent flex w-full cursor-pointer items-center gap-3 rounded-full border p-2 pr-4 text-left transition-colors'
        type='button'
      >
        <div className='relative shrink-0'>
          <Avatar className='size-10'>
            <AvatarFallback className='bg-gradient-to-br from-neutral-700 to-neutral-900 text-sm font-semibold text-white'>
              SC
            </AvatarFallback>
          </Avatar>
          <span className='ring-background bg-foreground absolute right-0 bottom-0 block size-2.5 rounded-full ring-2' />
        </div>
        <div className='flex flex-col items-start gap-0.5'>
          <span className='text-sm font-medium'>siberiacancode</span>
          <span className='text-muted-foreground text-xs'>Open-source team</span>
        </div>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align='start' className='min-w-64 rounded-2xl'>
      <DropdownMenuItem>
        <UserIcon />
        Profile
      </DropdownMenuItem>
      <DropdownMenuItem>
        <CreditCardIcon />
        Billing
      </DropdownMenuItem>
      <DropdownMenuItem>
        <SettingsIcon />
        Settings
        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant='destructive'>
        <LogOutIcon />
        Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

/* ── useCopy ── */

type PackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn';

const COMMANDS: Record<PackageManager, string> = {
  pnpm: 'pnpm add @siberiacancode/reactuse',
  npm: 'npm i @siberiacancode/reactuse',
  yarn: 'yarn add @siberiacancode/reactuse',
  bun: 'bun add @siberiacancode/reactuse'
};

const PACKAGE_MANAGERS: PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun'];

const CopyDemo = () => {
  const { copy, copied } = useCopy();
  const [manager, setManager] = useState<PackageManager>('pnpm');

  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='flex flex-col gap-1'>
        <h3 className='text-foreground text-base font-semibold'>Installation</h3>
        <p className='text-muted-foreground text-sm'>
          Add <code>reactuse</code> with your preferred package manager.
        </p>
      </div>

      <Tabs value={manager} onValueChange={(value) => setManager(value as PackageManager)}>
        <TabsList className='mb-3'>
          {PACKAGE_MANAGERS.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className='relative flex items-center'>
          <Input readOnly className='h-12 rounded-full pr-24 pl-4' value={COMMANDS[manager]} />
          <Button
            className='absolute right-1.5 h-9 rounded-full px-4'
            disabled={copied}
            size='lg'
            onClick={() => copy(COMMANDS[manager])}
          >
            {copied ? <CheckIcon className='size-4' /> : <CopyIcon className='size-4' />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </Tabs>
    </div>
  );
};

/* ── useField — full form ── */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Russian' },
  { value: 'de', label: 'German' }
];

const FieldDemo = () => {
  const nameField = useField('siberiacancode', { validateOnBlur: true });
  const emailField = useField('hello@reactuse.org', { validateOnBlur: true });
  const bioField = useField('Building open-source React hooks ✨');
  const languageField = useField('en');
  const notificationsField = useField(true);

  const language = languageField.watch();
  const notifications = notificationsField.watch();

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form className='flex w-full flex-col gap-4' onSubmit={onSubmit}>
      <div className='flex flex-col gap-1'>
        <h3 className='text-foreground text-base font-semibold'>Account settings</h3>
        <p className='text-muted-foreground text-sm'>Update your public profile.</p>
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='field-name'>Display name</Label>
        <Input
          id='field-name'
          placeholder='Your name'
          {...nameField.register({
            required: 'Name is required',
            minLength: { value: 2, message: 'At least 2 characters' }
          })}
        />
        {nameField.error && <span className='text-destructive text-xs'>{nameField.error}</span>}
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='field-email'>Email</Label>
        <Input
          id='field-email'
          placeholder='you@example.com'
          type='email'
          {...emailField.register({
            required: 'Email is required',
            pattern: { value: EMAIL_PATTERN, message: 'Invalid email format' }
          })}
        />
        {emailField.error && <span className='text-destructive text-xs'>{emailField.error}</span>}
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='field-bio'>Bio</Label>
        <Textarea
          className='min-h-[72px] resize-none'
          id='field-bio'
          placeholder='Tell something about yourself…'
          {...bioField.register()}
        />
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='field-language'>Language</Label>
        <input className='hidden' tabIndex={-1} {...languageField.register()} />
        <Select value={language} onValueChange={(value) => languageField.setValue(value)}>
          <SelectTrigger id='field-language'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='border-border flex items-center justify-between gap-3 border-t pt-4'>
        <div className='flex flex-col gap-0.5'>
          <span className='text-foreground text-sm font-medium'>Email notifications</span>
          <span className='text-muted-foreground text-xs'>Product updates and release notes</span>
        </div>
        <input
          className='hidden'
          tabIndex={-1}
          type='checkbox'
          {...notificationsField.register()}
        />
        <Switch
          checked={notifications}
          onCheckedChange={(checked) => notificationsField.setValue(checked)}
        />
      </div>

      <div className='flex justify-end'>
        <Button className='rounded-full px-5' size='lg' type='submit'>
          Save changes
        </Button>
      </div>
    </form>
  );
};

/* ── useMask — checkout ── */

interface Country {
  code: string;
  flag: string;
  mask: string;
  name: string;
}

const COUNTRIES = [
  { code: '7', name: 'Russia', flag: '🇷🇺', mask: '+9 (999) 999-99-99' },
  { code: '1', name: 'USA', flag: '🇺🇸', mask: '+9 (999) 999-9999' },
  { code: '44', name: 'UK', flag: '🇬🇧', mask: '+99 9999 999999' },
  { code: '77', name: 'Kazakhstan', flag: '🇰🇿', mask: '+99 (999) 999-99-99' },
  { code: '380', name: 'Ukraine', flag: '🇺🇦', mask: '+999 (99) 999-99-99' },
  { code: '998', name: 'Uzbekistan', flag: '🇺🇿', mask: '+999 (99) 999-99-99' }
] as const;

const DEFAULT_MASK = '999999999999999';

const SORTED_COUNTRIES = COUNTRIES.toSorted((a, b) => b.code.length - a.code.length);

const detectCountry = (rawValue: string): Country | undefined =>
  SORTED_COUNTRIES.find((country) => rawValue.startsWith(country.code));

const MaskDemo = () => {
  const name = useField('');
  const cvv = useField('');

  const phoneMask = useMask(DEFAULT_MASK, {
    showMask: 'never',
    modify: (rawValue) => ({ mask: detectCountry(rawValue)?.mask ?? DEFAULT_MASK }),
    beforeMaskedChange: ({ nextState }) => ({
      ...nextState,
      selection: { start: nextState.value.length, end: nextState.value.length }
    })
  });

  const phone = phoneMask.watch();
  const cardNumber = useMask('9999 9999 9999 9999', { showMask: 'never' });
  const expiry = useMask('99/99', { showMask: 'never' });

  const country = detectCountry(phone.rawValue);

  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='flex flex-col gap-1'>
        <h3 className='text-foreground text-base font-semibold'>Checkout</h3>
        <p className='text-muted-foreground text-xs'>Enter your details to pay $49.00.</p>
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label>Full name</Label>
        <Input placeholder='John Carter' {...name.register()} />
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label>Phone number</Label>
        <div className='relative'>
          {country && (
            <span className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-base'>
              {country.flag}
            </span>
          )}
          <Input
            className={cn(country ? 'pl-10' : 'pl-3')}
            inputMode='tel'
            placeholder='Start typing with country code'
            {...phoneMask.register()}
          />
        </div>
        {country && <span className='text-muted-foreground px-1 text-[10px]'>{country.name}</span>}
      </div>

      <div className='flex flex-col gap-2'>
        <Label>Card details</Label>
        <Input
          className='font-mono tracking-wider'
          inputMode='numeric'
          placeholder='1234 5678 9012 3456'
          {...cardNumber.register()}
        />
        <div className='flex gap-2'>
          <Input
            className='font-mono'
            inputMode='numeric'
            placeholder='MM/YY'
            {...expiry.register()}
          />
          <Input
            className='font-mono'
            inputMode='numeric'
            maxLength={3}
            placeholder='CVV'
            type='password'
            {...cvv.register()}
          />
        </div>
      </div>

      <Button className='rounded-full px-5' size='lg' type='button'>
        Pay $49.00
      </Button>
    </div>
  );
};

/* ── useMergedRef — framework select ── */

const FRAMEWORKS = [
  { value: 'react', label: 'React', logo: 'react' },
  { value: 'vue', label: 'Vue', logo: 'vuedotjs' },
  { value: 'svelte', label: 'Svelte', logo: 'svelte' },
  { value: 'angular', label: 'Angular', logo: 'angular' },
  { value: 'solid', label: 'SolidJS', logo: 'solid' },
  { value: 'qwik', label: 'Qwik', logo: 'qwik' }
];

const MergedRefDemo = () => {
  const menu = useDisclosure();
  const [value, setValue] = useState('react');
  const clickOutsideRef = useClickOutside<HTMLDivElement>(() => menu.close());
  const measure = useMeasure<HTMLDivElement>();
  const panelRef = useMergedRef(clickOutsideRef, measure.ref);
  const selected = FRAMEWORKS.find((framework) => framework.value === value);

  const onSelect = (next: string) => {
    setValue(next);
    menu.close();
  };

  return (
    <div className='flex w-full flex-col gap-1.5'>
      <span className='text-foreground text-sm font-medium'>Framework</span>
      <div className='relative'>
        <button
          aria-expanded={menu.opened}
          aria-haspopup='listbox'
          className='border-border bg-card hover:bg-accent flex w-full cursor-pointer items-center justify-between gap-2 rounded-full border px-3 py-2.5 transition-colors'
          type='button'
          onClick={() => menu.toggle()}
        >
          <span className='flex items-center gap-2'>
            <img
              alt=''
              className='size-4 dark:invert'
              src={`https://cdn.simpleicons.org/${selected?.logo}/000000`}
            />
            <span className='text-foreground text-sm font-medium'>{selected?.label}</span>
          </span>
          <ChevronDownIcon
            className={cn(
              'text-muted-foreground size-4 transition-transform',
              menu.opened && 'rotate-180'
            )}
          />
        </button>
        {menu.opened && (
          <div
            ref={panelRef}
            className='bg-popover text-popover-foreground absolute top-full right-0 left-0 z-10 mt-2 overflow-hidden rounded-md border p-1 shadow-md'
          >
            {FRAMEWORKS.map((framework) => (
              <button
                key={framework.value}
                className='hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 rounded-full px-2.5 py-1.5 text-sm transition-colors outline-none'
                type='button'
                onClick={() => onSelect(framework.value)}
              >
                <img
                  alt=''
                  className='size-4 dark:invert'
                  src={`https://cdn.simpleicons.org/${framework.logo}/000000`}
                />
                {framework.label}
                {framework.value === value && <CheckIcon className='ml-auto size-4' />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── useCssVar ── */

const ACCENT_COLORS = [
  { value: 'oklch(1 0 0)', label: 'White' },
  { value: 'oklch(0.55 0.18 250)', label: 'Blue' },
  { value: 'oklch(0.55 0.22 300)', label: 'Violet' },
  { value: 'oklch(0.65 0.22 0)', label: 'Pink' },
  { value: 'oklch(0.65 0.18 50)', label: 'Orange' },
  { value: 'oklch(0.65 0.15 160)', label: 'Green' }
];

const RADIUS_OPTIONS = [
  { value: '0rem', label: 'None' },
  { value: '0.5rem', label: 'Medium' },
  { value: '1rem', label: 'Large' }
];

const CssVarDemo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const primary = useCssVar(containerRef, '--demo-primary', 'oklch(1 0 0)');
  const radius = useCssVar(containerRef, '--demo-radius', '0.5rem');

  return (
    <div ref={containerRef} className='flex w-full flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <span className='text-foreground text-sm font-medium'>Accent</span>
        <div className='flex items-center gap-1.5'>
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.value}
              style={{
                backgroundColor: color.value,
                outline: primary.value === color.value ? `2px solid ${color.value}` : 'none',
                outlineOffset: '2px'
              }}
              aria-label={color.label}
              className='border-border size-5 cursor-pointer rounded-full border transition-transform hover:scale-110'
              type='button'
              onClick={() => primary.set(color.value)}
            />
          ))}
        </div>
      </div>

      <div className='flex items-center justify-between'>
        <span className='text-foreground text-sm font-medium'>Radius</span>
        <div className='bg-muted flex items-center gap-0.5 rounded-lg p-0.5'>
          {RADIUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                radius.value === option.value ? 'bg-background shadow-sm' : 'text-muted-foreground'
              )}
              type='button'
              onClick={() => radius.set(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <button
        className='border-border h-11 w-full rounded-full border text-sm font-medium text-neutral-900 transition-all'
        style={{ backgroundColor: 'var(--demo-primary)', borderRadius: 'var(--demo-radius)' }}
        type='button'
      >
        Live preview
      </button>
    </div>
  );
};

/* ── useDropZone + useFileDialog ── */

interface FilePreview {
  name: string;
  preview: string;
  size: number;
  type: string;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const DropZoneDemo = () => {
  const [file, setFile] = useState<FilePreview | null>(null);

  const readFile = (source: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setFile({
        name: source.name,
        size: source.size,
        type: source.type,
        preview: event.target?.result as string
      });
    };
    reader.readAsDataURL(source);
  };

  const fileDialog = useFileDialog(
    (files) => {
      if (!files?.length) return;
      readFile(files[0]);
    },
    { accept: 'image/*', multiple: false, reset: true }
  );

  const dropZone = useDropZone<HTMLDivElement>({
    dataTypes: ['image'],
    onDrop: (files) => {
      if (!files?.length) return;
      readFile(files[0]);
    }
  });

  return (
    <div className='w-full'>
      {!file && (
        <div
          ref={dropZone.ref}
          className={cn(
            'flex h-[200px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 transition-colors',
            dropZone.overed ? 'border-foreground bg-accent/30' : 'border-border hover:bg-accent/20'
          )}
          onClick={() => fileDialog.open()}
        >
          <div
            className={cn(
              'flex size-12 items-center justify-center rounded-full transition-colors',
              dropZone.overed ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
            )}
          >
            <UploadCloudIcon className='size-6' />
          </div>
          <div className='flex flex-col items-center gap-1 text-center'>
            <p className='text-foreground text-sm font-medium'>
              {dropZone.overed ? (
                'Drop image here'
              ) : (
                <>
                  <span className='underline'>Click to upload</span> or drag and drop
                </>
              )}
            </p>
            <p className='text-muted-foreground text-xs'>PNG, JPG or GIF up to 10MB</p>
          </div>
        </div>
      )}

      {file && (
        <div className='border-border bg-card relative h-[200px] overflow-hidden rounded-xl border'>
          <img
            aria-hidden
            className='absolute inset-0 size-full scale-110 object-cover blur-2xl'
            src={file.preview}
          />
          <div className='relative flex size-full flex-col justify-between'>
            <div className='flex size-full items-center justify-center'>
              <img
                alt={file.name}
                className='h-[120px] rounded-md object-contain'
                src={file.preview}
              />
            </div>
            <div className='flex w-full items-center gap-3 bg-black/40 px-3 py-2'>
              <div className='flex size-7 shrink-0 items-center justify-center rounded-md bg-white/15 text-white'>
                <ImageIcon className='size-3.5' />
              </div>
              <div className='flex min-w-0 flex-1 flex-col leading-tight'>
                <span className='truncate text-xs font-medium text-white'>{file.name}</span>
                <span className='text-[10px] text-white/70 tabular-nums'>
                  {formatSize(file.size)} · {file.type.replace('image/', '').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <Button
            aria-label='Remove'
            className='absolute top-2 right-2 rounded-full'
            size='icon-lg'
            variant='secondary'
            onClick={() => setFile(null)}
          >
            <XIcon className='size-4' />
          </Button>
        </div>
      )}
    </div>
  );
};

/* ── useOffsetPagination — compact user table ── */

const TOTAL = 24;
const PAGE_SIZE = 4;

interface TableUser {
  email: string;
  id: number;
  name: string;
  status: 'active' | 'invited';
}

const NAMES = ['Alex', 'Maria', 'John', 'Sofia', 'Liam', 'Emma', 'Noah', 'Olivia'];

const createUsers = (page: number): TableUser[] =>
  Array.from({ length: PAGE_SIZE }, (_, index) => {
    const id = PAGE_SIZE * (page - 1) + index + 1;
    const name = NAMES[id % NAMES.length];
    return {
      id,
      name,
      email: `${name.toLowerCase()}${id}@reactuse.dev`,
      status: id % 3 === 0 ? 'invited' : 'active'
    };
  });

const PaginationDemo = () => {
  const [users, setUsers] = useState<TableUser[]>(() => createUsers(1));

  const { page, pageCount, isFirstPage, isLastPage, next, prev } = useOffsetPagination({
    total: TOTAL,
    initialPage: 1,
    initialPageSize: PAGE_SIZE,
    onChange: ({ page }) => setUsers(createUsers(page))
  });

  return (
    <div className='flex w-full flex-col gap-3'>
      <h3 className='text-foreground text-base font-semibold'>Team members</h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead className='text-right'>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className='flex flex-col leading-tight'>
                  <span className='text-foreground font-medium'>{user.name}</span>
                  <span className='text-muted-foreground text-xs'>{user.email}</span>
                </div>
              </TableCell>
              <TableCell className='text-right'>
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 text-xs font-medium',
                    user.status === 'active' ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  <span
                    className={cn(
                      'size-1.5 rounded-full',
                      user.status === 'active' ? 'bg-foreground' : 'bg-muted-foreground'
                    )}
                  />
                  {user.status === 'active' ? 'Active' : 'Invited'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className='flex items-center justify-between'>
        <Button
          className='rounded-full px-4'
          disabled={isFirstPage}
          size='lg'
          variant='ghost'
          onClick={prev}
        >
          <ChevronLeftIcon className='size-4' />
          Prev
        </Button>
        <span className='text-muted-foreground text-xs tabular-nums'>
          {page} / {pageCount}
        </span>
        <Button
          className='rounded-full px-4'
          disabled={isLastPage}
          size='lg'
          variant='ghost'
          onClick={next}
        >
          Next
          <ChevronRightIcon className='size-4' />
        </Button>
      </div>
    </div>
  );
};

/* ── useQuery — Pokémon grid ── */

interface Pokemon {
  id: number;
  name: string;
}

interface Generation {
  pokemon_species: { name: string; url: string }[];
}

const getIdFromUrl = (url: string) => {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
};

const getSpriteUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const fetchGeneration = async (): Promise<Pokemon[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const data = (await fetch('https://pokeapi.co/api/v2/generation/1').then((res) =>
    res.json()
  )) as Generation;
  return data.pokemon_species
    .map((species) => ({ name: species.name, id: getIdFromUrl(species.url) }))
    .sort((a, b) => a.id - b.id);
};

const QueryDemo = () => {
  const pokemonQuery = useQuery(fetchGeneration);
  const pokemon = pokemonQuery.data ?? [];

  return (
    <div className='no-scrollbar h-[300px] w-full overflow-y-auto'>
      <div className='grid grid-cols-3 gap-2'>
        {pokemonQuery.isLoading &&
          Array.from({ length: 12 }, (_, index) => (
            <div
              key={index}
              className='border-border bg-card aspect-square animate-pulse rounded-xl border'
            />
          ))}

        {!pokemonQuery.isLoading &&
          pokemon.map((item) => (
            <div
              key={item.id}
              className='border-border bg-card hover:bg-muted/40 flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border p-2 transition-colors'
            >
              <img
                alt={item.name}
                className='size-12 object-contain'
                loading='lazy'
                src={getSpriteUrl(item.id)}
              />
              <span className='text-foreground w-full truncate text-center text-[11px] font-medium capitalize'>
                {item.name}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

/* ── useLongPress ── */

const THRESHOLD = 1500;

const PLAN_FEATURES = [
  'Every hook, fully typed',
  'Lifetime updates',
  'Private community access',
  'Priority support'
];

const LongPressDemo = () => {
  const success = useDisclosure();
  const [holding, setHolding] = useState(false);

  const longPress = useLongPress<HTMLButtonElement>(
    () => {
      setHolding(false);
      success.open();
    },
    {
      threshold: THRESHOLD,
      onStart: () => setHolding(true),
      onCancel: () => setHolding(false)
    }
  );

  return (
    <div className='flex w-full flex-col gap-5'>
      <div className='flex flex-col gap-2'>
        <span className='text-muted-foreground text-[10px] tracking-[0.15em] uppercase'>
          Lifetime plan
        </span>
        <div className='flex items-baseline gap-2'>
          <span className='text-foreground text-5xl font-bold tracking-tight tabular-nums'>
            $49
          </span>
          <span className='text-muted-foreground text-lg tabular-nums line-through'>$499</span>
        </div>
      </div>

      <div className='flex flex-col gap-2.5'>
        {PLAN_FEATURES.map((feature) => (
          <div key={feature} className='flex items-center gap-2.5'>
            <span className='bg-foreground/40 size-1.5 shrink-0 rounded-full' />
            <span className='text-foreground text-xs'>{feature}</span>
          </div>
        ))}
      </div>

      <button
        ref={longPress.ref}
        className={cn(
          'relative flex h-11 w-full items-center justify-center overflow-hidden rounded-full text-sm font-semibold transition-colors select-none',
          holding ? 'bg-muted text-muted-foreground' : 'bg-foreground text-background'
        )}
        type='button'
      >
        {holding ? (
          <span className='flex items-center gap-2'>
            <Loader2Icon className='size-4 animate-spin' />
            Confirming…
          </span>
        ) : success.opened ? (
          'Access unlocked'
        ) : (
          'Hold to unlock access'
        )}
      </button>

      <span className='text-muted-foreground text-center text-[10px]'>
        {success.opened ? 'Check your inbox for setup instructions' : 'Press and hold to confirm'}
      </span>
    </div>
  );
};

/* ── Section ── */

export interface LandingBentoHook {
  name: string;
}

interface LandingBentoHooksProps {
  hooks: LandingBentoHook[];
}

export const LandingBentoHooks = ({ hooks }: LandingBentoHooksProps) => (
  <section>
    <div className='container mx-auto px-6 py-24 md:py-32'>
      <motion.div
        className='flex max-w-3xl flex-col gap-6'
        initial={{ opacity: 0, y: -28 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.45 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h2 className='font-display text-foreground text-4xl font-bold tracking-tight uppercase md:text-8xl'>
          Explore hooks
        </h2>
        <p className='text-muted-foreground text-lg leading-relaxed md:text-xl'>
          Everything you keep rebuilding on every project — {hooks.length}+ production-ready hooks,
          already typed and tested.
        </p>
        <div className='flex flex-wrap items-center gap-2'>
          <Button asChild className='rounded-full px-7 py-6 font-mono text-lg font-semibold'>
            <Link href='/functions/hooks/useActiveElement'>
              <span>View all</span>
              <ArrowRight className='size-4' />
            </Link>
          </Button>
          <Button
            asChild
            className='rounded-full px-7 py-6 font-mono text-lg font-semibold'
            variant='secondary'
          >
            <Link href='/functions'>
              <span>Browse all functions</span>
              <ArrowRight className='size-4' />
            </Link>
          </Button>
        </div>
      </motion.div>

      <motion.div
        className='relative mt-14 max-h-[1100px] overflow-hidden'
        initial={{ opacity: 0, y: -32 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.2 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {/* Column 1 */}
          <div className='flex flex-col gap-4'>
            <Cell>
              <FieldDemo />
            </Cell>
            <Cell>
              <CounterDemo />
            </Cell>
            <Cell>
              <CssVarDemo />
            </Cell>
            <Cell>
              <ColorSchemeDemo />
            </Cell>
            <Cell>
              <OnlineDemo />
            </Cell>
          </div>

          {/* Column 2 */}
          <div className='flex flex-col gap-4'>
            <Cell>
              <MaskDemo />
            </Cell>
            <Cell className='p-3'>
              <DropZoneDemo />
            </Cell>
            <Cell>
              <CopyDemo />
            </Cell>
            <Cell>
              <DropdownDemo />
            </Cell>
            <Cell>
              <BooleanDemo />
            </Cell>
          </div>

          {/* Column 3 */}
          <div className='flex flex-col gap-4'>
            <Cell>
              <LongPressDemo />
            </Cell>
            <Cell>
              <PaginationDemo />
            </Cell>
            <Cell className='p-3'>
              <QueryDemo />
            </Cell>
            <Cell>
              <MergedRefDemo />
            </Cell>
          </div>
        </div>

        <div className='from-background pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t to-transparent' />
      </motion.div>
    </div>
  </section>
);
