import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useFileSystemAccess } from './useFileSystemAccess';

const mockHandle = {
  getFile: vi.fn(),
  createWritable: vi.fn(async () => ({
    write: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined)
  }))
};

class MockFile {
  content: string;
  name: string;
  type: string;

  constructor(content: BlobPart[], name: string, options: { type: string }) {
    this.content = content.map((element) => String(element)).join('');
    this.name = name;
    this.type = options.type;
  }

  text = () => Promise.resolve(this.content);

  arrayBuffer = () => Promise.resolve(new Uint8Array(this.content as unknown as Uint8Array).buffer);
}

beforeEach(() => {
  Object.assign(window, {
    File: MockFile,
    showOpenFilePicker: vi.fn().mockResolvedValue([mockHandle]),
    showSaveFilePicker: vi.fn().mockResolvedValue(mockHandle)
  });
});

it('Should use file system access', () => {
  const { result } = renderHook(useFileSystemAccess);

  expect(result.current.supported).toBe(true);
  expect(result.current.data).toBeUndefined();
  expect(result.current.file).toBeUndefined();
  expect(result.current.name).toBe('');
  expect(result.current.type).toBe('');
  expect(result.current.size).toBe(0);
  expect(result.current.lastModified).toBe(0);
  expect(result.current.open).toBeTypeOf('function');
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.create).toBeTypeOf('function');
  expect(result.current.save).toBeTypeOf('function');
  expect(result.current.saveAs).toBeTypeOf('function');
  expect(result.current.update).toBeTypeOf('function');
});

it('Should use file system access on server side', () => {
  const { result } = renderHookServer(useFileSystemAccess);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.data).toBeUndefined();
  expect(result.current.file).toBeUndefined();
  expect(result.current.name).toBe('');
  expect(result.current.type).toBe('');
  expect(result.current.size).toBe(0);
  expect(result.current.lastModified).toBe(0);
  expect(result.current.open).toBeTypeOf('function');
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.create).toBeTypeOf('function');
  expect(result.current.save).toBeTypeOf('function');
  expect(result.current.saveAs).toBeTypeOf('function');
  expect(result.current.update).toBeTypeOf('function');
});

it('Should use file system access for unsupported', () => {
  Object.assign(globalThis.window, {
    showOpenFilePicker: undefined,
    showSaveFilePicker: undefined
  });

  const { result } = renderHook(useFileSystemAccess);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.data).toBeUndefined();
  expect(result.current.file).toBeUndefined();
  expect(result.current.name).toBe('');
  expect(result.current.type).toBe('');
  expect(result.current.size).toBe(0);
  expect(result.current.lastModified).toBe(0);
  expect(result.current.open).toBeTypeOf('function');
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.create).toBeTypeOf('function');
  expect(result.current.save).toBeTypeOf('function');
  expect(result.current.saveAs).toBeTypeOf('function');
  expect(result.current.update).toBeTypeOf('function');
});

it('Should open file and load text data', async () => {
  const file = new File(['content'], 'file.txt', { type: 'text/plain' });
  vi.spyOn(globalThis.window, 'showOpenFilePicker').mockResolvedValue([
    {
      getFile: vi.fn().mockResolvedValue(file),
      createWritable: vi.fn().mockResolvedValue({
        write: vi.fn(),
        close: vi.fn()
      })
    }
  ]);

  const { result } = renderHook(useFileSystemAccess);

  await act(async () => {
    await result.current.open();
  });

  expect(result.current.name).toBe('file.txt');
  expect(result.current.type).toBe('text/plain');
  expect(result.current.data).toBe('content');
  expect(window.showOpenFilePicker).toHaveBeenCalled();
});

it('Should open file and load array buffer data', async () => {
  const buffer = new Uint8Array([1, 2, 3]).buffer;
  const file = new File([buffer], 'file.bin', {
    type: 'application/octet-stream'
  });
  vi.spyOn(globalThis.window, 'showOpenFilePicker').mockResolvedValue([
    {
      getFile: vi.fn().mockResolvedValue(file),
      createWritable: vi.fn().mockResolvedValue({
        write: vi.fn(),
        close: vi.fn()
      })
    }
  ]);

  const { result } = renderHook(() => useFileSystemAccess({ dataType: 'ArrayBuffer' }));

  await act(async () => {
    await result.current.open();
  });

  expect(result.current.name).toBe('file.bin');
  expect(result.current.type).toBe('application/octet-stream');
  expect(result.current.data).toBeInstanceOf(ArrayBuffer);
  expect(result.current.data).toEqual(buffer);
});

it('Should open file and load blob data', async () => {
  const blob = new Blob(['x']);
  const file = new File([blob], 'file.bin', { type: 'text/plain' });
  vi.spyOn(globalThis.window, 'showOpenFilePicker').mockResolvedValue([
    {
      getFile: vi.fn().mockResolvedValue(file),
      createWritable: vi.fn().mockResolvedValue({
        write: vi.fn(),
        close: vi.fn()
      })
    }
  ]);

  const { result } = renderHook(() => useFileSystemAccess({ dataType: 'Blob' }));

  await act(async () => {
    await result.current.open();
  });

  expect(result.current.data).toBe(file);
});

it('Should create new file and load data', async () => {
  const empty = new File([], 'file.txt', { type: 'text/plain' });
  vi.spyOn(globalThis.window, 'showSaveFilePicker').mockResolvedValue({
    getFile: vi.fn().mockResolvedValue(empty),
    createWritable: vi.fn().mockResolvedValue({
      write: vi.fn(),
      close: vi.fn()
    })
  });

  const { result } = renderHook(useFileSystemAccess);

  await act(async () => {
    await result.current.create({ suggestedName: 'file.txt' });
  });

  expect(window.showSaveFilePicker).toHaveBeenCalled();
  expect(result.current.name).toBe('file.txt');
});

it('Should save to current handle', async () => {
  const file = new File(['content'], 'file.txt', { type: 'text/plain' });
  vi.spyOn(globalThis.window, 'showOpenFilePicker').mockResolvedValue([
    {
      getFile: vi.fn().mockResolvedValue(file),
      createWritable: vi.fn().mockResolvedValue({
        write: vi.fn(),
        close: vi.fn()
      })
    }
  ]);

  const { result } = renderHook(useFileSystemAccess);

  await act(async () => {
    await result.current.open();
    await result.current.save();
  });

  expect(window.showOpenFilePicker).toHaveBeenCalled();
  expect(result.current.data).toBe('content');
});

it('Should save as new file', async () => {
  const file = new File(['content'], 'file.txt', { type: 'text/plain' });
  vi.spyOn(globalThis.window, 'showSaveFilePicker').mockResolvedValue({
    getFile: vi.fn().mockResolvedValue(file),
    createWritable: vi.fn().mockResolvedValue({
      write: vi.fn(),
      close: vi.fn()
    })
  });

  const { result } = renderHook(useFileSystemAccess);

  await act(async () => {
    await result.current.saveAs({ suggestedName: 'file.txt' });
  });

  expect(window.showSaveFilePicker).toHaveBeenCalled();
  expect(result.current.data).toBe('content');
});

it('Should update from current handle', async () => {
  const file = new File(['content'], 'file.txt', { type: 'text/plain' });
  vi.spyOn(globalThis.window, 'showOpenFilePicker').mockResolvedValue([
    {
      getFile: vi.fn().mockResolvedValue(file),
      createWritable: vi.fn().mockResolvedValue({
        write: vi.fn(),
        close: vi.fn()
      })
    }
  ]);

  const { result } = renderHook(useFileSystemAccess);

  await act(async () => {
    await result.current.open();
  });

  expect(result.current.data).toBe('content');

  file.text = () => Promise.resolve('updated');

  await act(async () => {
    await result.current.update();
  });

  expect(result.current.data).toBe('updated');
});

it('Should fallback save to save as new file', async () => {
  const file = new File(['content'], 'file.txt', { type: 'text/plain' });
  vi.spyOn(globalThis.window, 'showSaveFilePicker').mockResolvedValue({
    getFile: vi.fn().mockResolvedValue(file),
    createWritable: vi.fn().mockResolvedValue({
      write: vi.fn(),
      close: vi.fn()
    })
  });

  const { result } = renderHook(useFileSystemAccess);

  await act(async () => {
    await result.current.save({ suggestedName: 'file.txt' });
  });

  expect(window.showSaveFilePicker).toHaveBeenCalled();
  expect(result.current.data).toBe('content');
});

it('Should set data', () => {
  const { result } = renderHook(useFileSystemAccess);

  expect(result.current.data).toBeUndefined();

  act(() => result.current.set('content'));

  expect(result.current.data).toBe('content');
});
