import { useTextSelection } from '@siberiacancode/reactuse';

const Demo = () => {
  const textSelection = useTextSelection();

  return (
    <>
      <p>You can select any text on the page</p>
      <p>
        <strong>Selected Text: </strong>
        <code>{textSelection.text || 'No selected'}</code>
      </p>
      <div>
        <strong>Selected rects: </strong>
        <pre lang='json'>{JSON.stringify(textSelection.rects, null, 2)}</pre>
      </div>
    </>
  );
};

export default Demo;
