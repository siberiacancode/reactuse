import { useDisclosure } from './useDisclosure';

const Demo = () => {
  const modal = useDisclosure();

  return (
    <div>
      <p>
        Opened: <code>{String(modal.opened)}</code>
      </p>
      {modal.opened && (
        <p>
          <code>Modal content</code>
        </p>
      )}
      <button type='button' onClick={() => modal.open()}>
        Open
      </button>
      <button type='button' onClick={() => modal.close()}>
        Close
      </button>
      <button type='button' onClick={() => modal.toggle()}>
        Toggle
      </button>
    </div>
  );
};

export default Demo;
