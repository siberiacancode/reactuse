import { useThrottleCallback } from '@siberiacancode/reactuse';
import { useState } from 'react';

const SETTINGS = [
  { key: 'quality', label: 'Quality', min: 10, max: 100 },
  { key: 'brightness', label: 'Brightness', min: 50, max: 150 },
  { key: 'contrast', label: 'Contrast', min: 50, max: 150 },
  { key: 'saturation', label: 'Saturation', min: 0, max: 200 }
] as const;

const DEFAULT_SETTINGS = { quality: 80, brightness: 100, contrast: 100, saturation: 100 };

const Demo = () => {
  const [values, setValues] = useState(DEFAULT_SETTINGS);
  const [applied, setApplied] = useState(DEFAULT_SETTINGS);

  const applyValues = useThrottleCallback((next: typeof DEFAULT_SETTINGS) => setApplied(next), 100);

  const onChange = (key: string, value: number) => {
    const next = { ...values, [key]: value };
    setValues(next);
    applyValues(next);
  };

  const sizeKb = Math.round(60 + (applied.quality / 100) * 1840);
  const blur = (100 - applied.quality) / 50;

  const filter = [
    `blur(${blur}px)`,
    `brightness(${applied.brightness}%)`,
    `contrast(${applied.contrast}%)`,
    `saturate(${applied.saturation}%)`
  ].join(' ');

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div data-slot='card'>
        <div className='flex flex-col gap-4' data-slot='card-content'>
          <div className='bg-muted relative aspect-[4/3] w-full overflow-hidden rounded-xl'>
            <img
              alt='Tokyo'
              className='size-full object-cover transition-[filter] duration-200'
              src='/new/images/tokyo.png'
              style={{ filter }}
            />
            <span className='bg-background/85 text-foreground absolute top-2.5 left-2.5 rounded-md px-2 py-1 font-mono text-xs tabular-nums shadow-sm backdrop-blur'>
              {(sizeKb / 1024).toFixed(2)} MB
            </span>
          </div>

          <div className='flex flex-col gap-3'>
            {SETTINGS.map((setting) => {
              const value = values[setting.key as keyof typeof values];
              const progress = ((value - setting.min) / (setting.max - setting.min)) * 100;
              return (
                <div key={setting.key} className='flex flex-col gap-1.5'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-foreground font-medium'>{setting.label}</span>
                    <span className='text-muted-foreground font-mono text-xs tabular-nums'>
                      {value}
                      {setting.key === 'quality' ? '%' : ''}
                    </span>
                  </div>
                  <input
                    max={setting.max}
                    min={setting.min}
                    style={{ ['--range-progress' as string]: `${progress}%` }}
                    type='range'
                    value={value}
                    onChange={(event) => onChange(setting.key, Number(event.target.value))}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
