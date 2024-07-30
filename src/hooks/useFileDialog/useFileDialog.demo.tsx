import { useFileDialog } from './useFileDialog';

const Demo = () => {
  const fileDialog = useFileDialog();

  return (
    <p>
      <button type='button' onClick={() => fileDialog.open()}>
        Choose files
      </button>
      <button type='button' disabled={!fileDialog.value} onClick={() => fileDialog.reset()}>
        Reset
      </button>
      {fileDialog.value && (
        <div>
          <p>
            You have selected: <b>{fileDialog.value.length} files</b>
            {Array.from(fileDialog.value).map((file) => (
              <li key={file.name}>
                <code>{file.name}</code>
              </li>
            ))}
          </p>
        </div>
      )}
    </p>
  );
};

export default Demo;
