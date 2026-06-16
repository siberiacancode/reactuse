import { useImage } from '@siberiacancode/reactuse';
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';

const MIN_ID = 1;
const MAX_ID = 151;

const getImageUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const getFilename = (id: number) => `pokemon-${String(id).padStart(3, '0')}.png`;

const downloadImage = (img: HTMLImageElement, filename: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  canvas.getContext('2d')!.drawImage(img, 0, 0);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(blobUrl);
  });
};

const Demo = () => {
  const [id, setId] = useState(MIN_ID);

  const image = useImage(getImageUrl(id), { crossorigin: 'anonymous' });
  const filename = getFilename(id);
  const isLoading = image.isLoading || image.isRefetching;

  const onPrev = () => setId((value) => Math.max(MIN_ID, value - 1));
  const onNext = () => setId((value) => Math.min(MAX_ID, value + 1));
  const onDownload = () => {
    if (!image.data) return;
    downloadImage(image.data, filename);
  };

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      <div className='bg-card relative flex h-[240px] items-center justify-center overflow-hidden rounded-xl shadow-sm'>
        {isLoading && (
          <div className='bg-card/70 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[1px]'>
            <Loader2Icon className='text-muted-foreground size-8 animate-spin' />
          </div>
        )}

        {image.data && (
          <img
            alt={filename}
            className='animate-in fade-in h-[160px] object-contain duration-300'
            src={image.data.src}
          />
        )}

        <button
          aria-label='Previous'
          className='absolute top-1/2 left-2 -translate-y-1/2 rounded-full!'
          data-size='icon'
          data-variant='ghost'
          disabled={id === MIN_ID}
          type='button'
          onClick={onPrev}
        >
          <ChevronLeftIcon className='size-4' />
        </button>

        <button
          aria-label='Next'
          className='absolute top-1/2 right-2 -translate-y-1/2 rounded-full!'
          data-size='icon'
          data-variant='ghost'
          disabled={id === MAX_ID}
          type='button'
          onClick={onNext}
        >
          <ChevronRightIcon className='size-4' />
        </button>

        <button
          aria-label='Download'
          className='absolute top-3 right-3 rounded-full!'
          data-size='icon'
          data-variant='ghost'
          disabled={isLoading || !image.data}
          type='button'
          onClick={onDownload}
        >
          <DownloadIcon className='size-4' />
        </button>

        <span className='text-foreground absolute bottom-5 flex w-full items-center justify-between px-4 font-mono text-xs font-semibold'>
          {filename}
        </span>
      </div>
    </section>
  );
};

export default Demo;
