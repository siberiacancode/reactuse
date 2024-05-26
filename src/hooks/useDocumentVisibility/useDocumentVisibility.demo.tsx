import React from 'react';

import { useNonInitialEffect } from '../useNonInitialEffect/useNonInitialEffect';

import { useDocumentVisibility } from './useDocumentVisibility';

const Demo = () => {
  const documentVisibility = useDocumentVisibility();

  useNonInitialEffect(() => {
    console.log(`Current document visibility state: ${documentVisibility}`);

    if (documentVisibility === 'visible') {
      alert(`Current document visibility state: ${documentVisibility}`);
    }
  }, [documentVisibility]);

  return (
    <div>
      <p>
        Switch to another tab and then return here
        <br />
        <br />
        Visibility status: <code>{documentVisibility}</code>
      </p>
    </div>
  );
};

export default Demo;
