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
    !!window.showOpenFilePicker &&
    !!window.showSaveFilePicker;
  const dataType = options.dataType ?? 'Text';
  const handleRef = useRef(undefined);
  const [data, setData] = useState();
  const [file, setFile] = useState();
  const load = async () => {
    const handle = handleRef.current;
    if (!handle) throw new Error('No file handle');
    const file = await handle.getFile();
    setFile(file);
    const actionMap = {
      Text: () => file.text(),
      ArrayBuffer: () => file.arrayBuffer(),
      Blob: () => file
    };
    const data = await actionMap[dataType]();
    setData(data);
    return data;
  };
  const open = async (params) => {
    const [handle] = await window.showOpenFilePicker({
      ...options,
      ...params
    });
    handleRef.current = handle;
    return load();
  };
  const create = async (params = {}) => {
    handleRef.current = await window.showSaveFilePicker({
      ...options,
      ...params
    });
    setData(undefined);
    return load();
  };
  const saveAs = async (params) => {
    handleRef.current = await window.showSaveFilePicker({
      ...options,
      ...params
    });
    const writable = await handleRef.current.createWritable();
    await writable.write(data);
    await writable.close();
    return load();
  };
  const save = async (params) => {
    if (!handleRef.current) return saveAs(params);
    const writable = await handleRef.current.createWritable();
    await writable.write(data);
    await writable.close();
    return load();
  };
  const update = load;
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
