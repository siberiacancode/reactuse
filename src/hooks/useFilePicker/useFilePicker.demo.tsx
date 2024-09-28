import { useFilePicker } from './useFilePicker';

// TODO: Extend example
const Demo = () => {
  const { onChange, files, errors } = useFilePicker({
    maxSize: 1024,
    accept: '.doc'
  });

  return (
    <section>
      <input type='file' onChange={onChange} />
      {files.map((file) => (
        <p key={file.name}>{file.name}</p>
      ))}
      {errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </section>
  );
};

export default Demo;
