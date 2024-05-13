import React from 'react';

export const useBoolean = (initialValue = false) => {
  const [value, setValue] = React.useState(initialValue);
  const toggle = (value?: boolean) => setValue((prev) => value ?? !prev);

  return [value, toggle];
};
