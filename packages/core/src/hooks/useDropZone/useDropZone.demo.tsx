import { useState } from "react";
import { useDropZone } from "./useDropZone"; // Assuming the hook is in this file

interface FileMeta {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

const Demo = () => {
  const [files, setFiles] = useState<FileMeta[]>([]);

  const onDrop = (files: File[] | null) => {
    console.log("hello", files);

    setFiles([]);

    if (!files) return;

    setFiles(
      files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      }))
    );
  };

  const { ref, isOverDropZone } = useDropZone({ onDrop });

  return (
    <div>
      <p>Drop files from your computer on to drop zones</p>
      <div
        ref={ref}
        className="flex flex-col h-[300px] w-full min-h-200px  bg-gray-400/10 justify-center items-center mt-6 rounded"
      >
        <p className="text-xl font-bold">Drop Zone</p>
        <p>isOverDropZone: {String(isOverDropZone)}</p>
        {!!files.length &&
          files.map((file) => (
            <div className="flex flex-col">
              <p>a: {file.name}</p>
              <p>a: {file.size}</p>
              <p>a: {file.type}</p>
              <p>a: {file.lastModified}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Demo;
