import { useState } from 'react';
import { useDropZone } from './useDropZone';

interface FileMeta {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

const Demo = () => {
  const [files, setFiles] = useState<FileMeta[]>([]);

  const onDrop = (files: File[] | null) => {
    setFiles([]);

    if (!files) return;

    setFiles(
      files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }))
    );
  };

  const dropZone = useDropZone<HTMLDivElement>(onDrop);

  return (
    <div>
      <p>Drop files from your computer on to drop zones</p>
      <div
        ref={dropZone.ref}
        className='flex flex-col p-5 w-full min-h-[300px] bg-gray-400/10 mt-6 rounded'
      >
        <div className='m-auto'>
          <p className='text-xl font-bold'>Drop Zone</p>
          <p>
            isOver:{' '}
            <span className={dropZone.isOver ? 'text-green-500' : 'text-red-500'}>
              {String(dropZone.isOver)}
            </span>
          </p>
        </div>
        <div className='flex flex-col gap-3'>
          {!!files.length &&
            files.map((file, index) => (
              <div key={index} className='flex p-5 bg-gray-400/5 flex-col rounded'>
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
    </div>
  );
};

export default Demo;
