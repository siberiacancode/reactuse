import { useDropZone, useFileDialog } from '@siberiacancode/reactuse';
import { ImageIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

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

const Demo = () => {
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

  const onDrop = (files: File[] | null) => {
    if (!files?.length) return;
    readFile(files[0]);
  };

  const fileDialog = useFileDialog(
    (files) => {
      if (!files?.length) return;
      readFile(files[0]);
    },
    {
      accept: 'image/*',
      multiple: false,
      reset: true
    }
  );

  const onPick = () => fileDialog.open();
  const onRemove = () => setFile(null);

  const dropZone = useDropZone<HTMLDivElement>({
    dataTypes: ['image'],
    onDrop
  });

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      {!file && (
        <div
          ref={dropZone.ref}
          className={cn(
            'flex h-[220px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 transition-colors',
            dropZone.overed
              ? 'border-foreground bg-accent/30'
              : 'border-border bg-card hover:bg-accent/20'
          )}
          onClick={onPick}
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
              {dropZone.overed && 'Drop image here'}
              {!dropZone.overed && (
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
        <div className='border-border bg-card relative h-[220px] overflow-hidden rounded-xl border shadow-sm'>
          <img
            aria-hidden
            className='absolute inset-0 size-full scale-110 object-cover blur-2xl'
            src={file.preview}
          />

          <div className='relative flex size-full flex-col justify-between'>
            <div className='flex size-full items-center justify-center'>
              <img
                alt={file.name}
                className='h-[140px] rounded-md object-contain'
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
                  {formatSize(file.size)} - {file.type.replace('image/', '').toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <button
            aria-label='Remove'
            className='absolute top-2 right-2'
            data-size='icon'
            data-variant='secondary'
            type='button'
            onClick={onRemove}
          >
            <XIcon className='size-4' />
          </button>
        </div>
      )}
    </section>
  );
};

export default Demo;
