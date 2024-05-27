import React from 'react';

export const useDefault = <Value>(initialValue: Value | (() => Value), defaultValue: Value) => {
  const [value, setValue] = React.useState<Value | undefined | null>(initialValue);
  return [value === undefined || value === null ? defaultValue : value, setValue] as const;
};
