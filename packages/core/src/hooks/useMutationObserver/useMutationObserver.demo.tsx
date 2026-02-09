import { useMutationObserver } from '@siberiacancode/reactuse';
import { useState } from 'react';

export const Demo = () => {
  const [observed, setObserved] = useState(false);

  const buttonObserver = useMutationObserver<HTMLButtonElement>({
    onChange: (mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          setObserved(true);
        }
      }
    },
    attributes: true
  });

  const addAttribute = () => {
    if (!buttonObserver.ref.current) return;
    buttonObserver.ref.current.setAttribute('data-mut', 'hello world');
  };

  return (
    <div>
      <div>{observed ? 'Observed attribute change to node' : 'No changes observed yet'}</div>

      <button ref={buttonObserver.ref} disabled={observed} type='button' onClick={addAttribute}>
        {observed ? 'Added Attribute To Node' : 'Add Attribute To Node'}
      </button>
    </div>
  );
};

export default Demo;
