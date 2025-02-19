/* eslint-disable ts/ban-ts-comment */
import type { ReactNode } from 'react';

import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { act } from 'react-dom/test-utils';

/**
 * @see https://github.com/testing-library/react-testing-library/issues/1120#issuecomment-1516132279
 * currently there is no correct way how to test server-side rendered hooks before hydration in rtl
 */
export const renderHookServer = <Hook extends () => any>(
  useHook: Hook,
  {
    wrapper: Wrapper
  }: {
    wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  } = {}
): { result: { current: ReturnType<Hook> }; hydrate: () => void } => {
  const originalWindow = globalThis.window;
  const originalNavigator = globalThis.navigator;
  const originalDocument = globalThis.document;
  // @ts-ignore
  delete globalThis.window;
  // @ts-ignore
  delete globalThis.navigator
  // @ts-ignore
  delete globalThis.document


  const results: Array<ReturnType<Hook>> = [];
  const result = {
    get current() {
      return results.slice(-1)[0];
    }
  };
  const setValue = (value: ReturnType<Hook>) => results.push(value);

  const Component = ({ useHook }: { useHook: Hook }) => {
    setValue(useHook() as ReturnType<Hook>);
    return null;
  };

  const component = Wrapper ? (
    <Wrapper>
      <Component useHook={useHook} />
    </Wrapper>
  ) : (
    <Component useHook={useHook} />
  );

  const serverOutput = renderToString(component);
  globalThis.window = originalWindow;
  globalThis.navigator = originalNavigator;
  globalThis.document = originalDocument;

  const hydrate = () => {
    const root = document.createElement('div');
    root.innerHTML = serverOutput;
    act(() => hydrateRoot(root, component));
  };

  return {
    result,
    hydrate
  };
};
