import { useDocumentTitle } from './useDocumentTitle';

const Demo = () => {
  const documentTitle = useDocumentTitle();

  return (
    <div>
      <p>Title: {documentTitle.value}</p>
      <input
        defaultValue={documentTitle.value}
        onChange={(event) => documentTitle.set(event.target.value)}
      />
    </div>
  );
};

export default Demo;
