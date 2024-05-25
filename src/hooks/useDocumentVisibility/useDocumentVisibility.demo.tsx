import React, { useEffect, useState } from 'react';

import { useDocumentVisibility } from './useDocumentVisibility';

const Demo = () => {
  const visibilityState = useDocumentVisibility();
  const [visible, setVisible] = useState(visibilityState);

  useEffect(() => {
    let timeoutId: string | number | NodeJS.Timeout | undefined;

    if (visibilityState === 'hidden') {
      setVisible(visibilityState);
    } else {
      timeoutId = setTimeout(() => {
        setVisible(visibilityState);
      }, 1000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [visibilityState]);

  return (
    <div>
      <p>
        <strong>Minimize the page or switch to another tab, and then return here.</strong>
        <br />
        Visibility state: <code>{visible}</code>
      </p>
    </div>
  );
};

export default Demo;
