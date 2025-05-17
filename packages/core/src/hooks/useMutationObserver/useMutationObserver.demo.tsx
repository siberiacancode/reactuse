import { useMutationObserver } from '@siberiacancode/reactuse';
import { useRef, useState } from 'react';

export const Demo = () => {
  const [observed, setObserved] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useMutationObserver(
    buttonRef,
    (mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          setObserved(true);
        }
      }
    },
    { attributes: true }
  );

  const addAttribute = () => {
    if (!buttonRef.current) return;

    buttonRef.current.setAttribute('data-mut', 'hello world');
  };

  return (
    <div>
      <div>{observed ? 'Observed attribute change to node' : 'No changes observed yet'}</div>

      <button ref={buttonRef} disabled={observed} type='button' onClick={addAttribute}>
        {observed ? 'Added Attribute To Node' : 'Add Attribute To Node'}
      </button>
    </div>
  );
};

export default Demo;
