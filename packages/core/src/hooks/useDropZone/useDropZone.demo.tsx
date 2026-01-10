import { useState } from 'react';

import { useDropZone } from './useDropZone';

interface FileMeta {
  lastModified: number;
  name: string;
  size: number;
  type: string;
}

const Demo = () => {
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  const callback = (files: File[] | null) => {
    if (!files) return;
    const file = files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      const imagePreview = event.target?.result as string;
      setPreview(imagePreview);
      setFiles([
        {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        }
      ]);
    };
    reader.readAsDataURL(file);
  };

  const onRemove = () => {
    setPreview(null);
    setFiles([]);
  };

  const dropZone = useDropZone<HTMLDivElement>({
    dataTypes: ['image'],
    onDrop: callback
  });

  return (
    <div>
      <p>Drop images from your computer on to drop zones</p>
      <div ref={dropZone.ref} className='relative mt-6'>
        {!preview && (
          <div className='m-auto flex min-h-[300px] w-full flex-col items-center justify-center rounded rounded-md border border-dashed text-sm'>
            <span className={dropZone.overed ? 'text-green-300' : 'text-red-300'}>
              {dropZone.overed ? 'Drop zone is over' : 'Drop zone is not over'}
            </span>
          </div>
        )}

        {!!preview && (
          <div className='flex h-full w-full flex-col gap-3'>
            <div className='relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border bg-transparent transition outline-none focus-visible:ring-2'>
              <div>
                <img
                  className='absolute inset-0 h-full w-full scale-110 object-cover blur-md'
                  src={preview}
                  onLoad={() => URL.revokeObjectURL(preview)}
                />
                <div className='bg-background/40 absolute inset-0' />
              </div>
              <div className='relative z-10 flex items-center justify-center'>
                <img className='max-h-[300px] max-w-full rounded-md object-contain' src={preview} />
              </div>
              <button
                className='absolute top-3 right-3 z-10 px-2! py-2! leading-none!'
                type='button'
                onClick={(event) => {
                  event.stopPropagation();
                  onRemove();
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      <div className='mt-3 text-sm'>
        {files.map((file) => (
          <div key={file.name} className='flex flex-col gap-1 rounded-lg bg-gray-400/5 p-3'>
            <div>
              <span className='font-bold'>File name:</span> {file.name}
            </div>
            <div>
              <span className='font-bold'>Size:</span> {file.size}
            </div>
            <div>
              <span className='font-bold'>Type:</span> {file.type}
            </div>
            <div>
              <span className='font-bold'>Last modified:</span> {file.lastModified}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Demo;
