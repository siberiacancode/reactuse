import React from 'react';

export type UseToggleReturn<Value> = readonly [Value, (value?: Value) => void];

export const useToggle = <Value = boolean>(values: readonly Value[] = [false, true] as any) => {
  const [[option], toggle] = React.useReducer(
    (state: Value[], action: React.SetStateAction<Value>) => {
      const value = action instanceof Function ? action(state[0]) : action;
      const index = Math.abs(state.indexOf(value));
      return state.slice(index).concat(state.slice(0, index));
    },
    values as Value[]
  );

  return [option, toggle as (value?: Value) => void] as const;
};
