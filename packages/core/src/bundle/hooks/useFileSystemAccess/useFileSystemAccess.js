import { useRef, useState } from 'react';
/**
 * @name useFileSystemAccess
 * @description - Hook for reading and writing local files via the File System Access API
 * @category Browser
 * @usage low
 *
 * @browserapi File System Access API https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
 *
 * @overload
 * @returns {UseFileSystemAccessReturn<string | ArrayBuffer | Blob>}
 *
 * @overload
 * @param {UseFileSystemAccessOptions} [options]
 * @returns {UseFileSystemAccessReturn}
 *
 * @example
 * const fileSystemAccess = useFileSystemAccess({ dataType: 'Text' });
 */
export const useFileSystemAccess = (options = {}) => {
  const supported =
    typeof window !== 'undefined' &&
    'showOpenFilePicker' in window &&
    'showSaveFilePicker' in window &&
    typeof window.showOpenFilePicker === 'function' &&
    typeof window.showSaveFilePicker === 'function';
  const dataType = options.dataType ?? 'Text';
  const handleRef = useRef(undefined);
  const [data, setData] = useState();
  const [file, setFile] = useState();
  const load = async () => {
    const handle = handleRef.current;
    if (!handle) return;
    const file = await handle.getFile();
    setFile(file);
    if (dataType === 'Text') return setData(await file.text());
    if (dataType === 'ArrayBuffer') return setData(await file.arrayBuffer());
    if (dataType === 'Blob') return setData(file);
    throw new Error(`Invalid data type: ${dataType}`);
  };
  const open = async (params) => {
    if (!supported) return;
    const [handle] = await window.showOpenFilePicker({
      ...options,
      ...params
    });
    handleRef.current = handle;
    await load();
  };
  const create = async (params = {}) => {
    if (!supported) return;
    handleRef.current = await window.showSaveFilePicker({
      ...options,
      ...params
    });
    setData(undefined);
    await load();
  };
  const saveAs = async (params) => {
    if (!supported) return;
    handleRef.current = await window.showSaveFilePicker({
      ...options,
      ...params
    });
    const writable = await handleRef.current.createWritable();
    await writable.write(data);
    await writable.close();
    await load();
  };
  const save = async (params) => {
    if (!supported) return;
    if (!handleRef.current) return saveAs(params);
    const writable = await handleRef.current.createWritable();
    await writable.write(data);
    await writable.close();
    await load();
  };
  const update = async () => {
    await load();
  };
  const set = (data) => setData(data);
  return {
    supported,
    data,
    file,
    name: file?.name ?? '',
    type: file?.type ?? '',
    size: file?.size ?? 0,
    lastModified: file?.lastModified ?? 0,
    open,
    set,
    create,
    save,
    saveAs,
    update
  };
};
