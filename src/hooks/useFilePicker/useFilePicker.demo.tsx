import type { UseFilePickerOptions } from './useFilePicker';
import { FilePickerValidationError, useFilePicker } from './useFilePicker';

const Demo = () => {
  const options: UseFilePickerOptions = {
    accept: ['.pdf', '.docx', '.doc'],
    minSize: 1024,
    maxSize: 1024 * 1024 * 10
  };

  const { files, errors, onChange, reset } = useFilePicker(options);

  return (
    <section>
      <input type='file' multiple onChange={onChange} />
      <button type='button' onClick={reset}>
        Reset
      </button>

      <h3>Selected Files:</h3>
      <ul>
        {files.map((file) => (
          <li key={file.name}>{file.name}</li>
        ))}
      </ul>

      <h3>Errors:</h3>
      <ul>
        {errors.map((error) => (
          <li key={error.fileName}>
            {error.fileName}
            {' – '}
            {error.errorType === FilePickerValidationError.WrongExtension
              ? 'Wrong Extension'
              : error.errorType === FilePickerValidationError.TooLarge
                ? 'Too Large'
                : 'Too Small'}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Demo;
