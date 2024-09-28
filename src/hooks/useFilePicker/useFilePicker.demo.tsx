import { useFilePicker } from './useFilePicker';

const Demo = () => {
  const { onChange, files, errors } = useFilePicker({
    maxSize: 539_953,
    accept: '.doc'
  });

  return (
    <section>
      <input type='file' onChange={onChange} />
      {files.map((file) => (
        <p key={file.name}>{file.name}</p>
      ))}
      {errors.map((error) => (
        <p key={error.fileName}>
          {error.fileName}: {error.errorType}
        </p>
      ))}
    </section>
  );
};

export default Demo;
