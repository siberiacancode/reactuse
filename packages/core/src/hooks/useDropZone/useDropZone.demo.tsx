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
      <div ref={dropZone.ref} className='mt-6 flex min-h-[300px] w-full flex-col rounded p-5'>
        {!preview && (
          <div className='m-auto'>
            <p>
              <span className={dropZone.overed ? 'text-green-300' : 'text-red-300'}>
                {dropZone.overed ? 'Drop zone is over' : 'Drop zone is not over'}
              </span>
            </p>
          </div>
        )}

        {!!preview && (
          <div className='flex flex-col gap-3'>
            <div className='relative'>
              <button
                className='absolute right-2 top-1 flex size-8 items-center justify-center'
                onClick={onRemove}
              >
                ✕
              </button>
              <img
                alt='Preview'
                className='mx-auto max-h-[400px] max-w-full rounded-lg'
                src={preview}
              />
            </div>

            <div className='flex flex-col gap-2'>
              {files.map((file, index) => (
                <div key={index} className='flex flex-col rounded-lg bg-gray-400/5 p-3'>
                  <p>
                    <span className='font-bold'>File name:</span> {file.name}
                  </p>
                  <p>
                    <span className='font-bold'>Size:</span> {file.size}
                  </p>
                  <p>
                    <span className='font-bold'>Type:</span> {file.type}
                  </p>
                  <p>
                    <span className='font-bold'>Last modified:</span> {file.lastModified}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Demo;
