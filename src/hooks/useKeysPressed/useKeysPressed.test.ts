import { fireEvent, renderHook } from '@testing-library/react';

import { useKeysPressed } from './useKeysPressed';

describe('Should use keys pressed', () => {
  it('Should set only unique keys', () => {
    const props = {
      enabled: true,
      target: document
    };
    const { result } = renderHook(() => useKeysPressed(props));

    fireEvent.keyDown(document, {
      key: 'c',
      code: 'KeyC'
    });
    fireEvent.keyDown(document, {
      key: 'g',
      code: 'KeyG'
    });
    fireEvent.keyDown(document, {
      key: 'c',
      code: 'KeyC'
    });

    expect(result.current).toEqual([
      {
        key: 'c',
        code: 'KeyC'
      },
      {
        key: 'g',
        code: 'KeyG'
      }
    ]);
  });

  it("Shouldn't set keys", () => {
    const props = {
      enabled: false,
      target: document
    };
    const { result } = renderHook(() => useKeysPressed(props));

    fireEvent.keyDown(document, {
      key: '2',
      code: 'Numpad2'
    });
    fireEvent.keyDown(document, {
      key: '/',
      code: 'Slash'
    });

    expect(result.current).toHaveLength(0);
  });

  it('Should reset keys after disabling', () => {
    const initialProps = {
      enabled: true,
      target: document
    };
    const { rerender, result } = renderHook((props) => useKeysPressed(props), {
      initialProps
    });

    fireEvent.keyDown(document, {
      key: 'Meta',
      code: 'MetaLeft'
    });
    rerender({
      target: document,
      enabled: false
    });

    expect(result.current).toHaveLength(0);
  });

  it('Should clear keys after keyUp event', () => {
    const props = {
      enabled: true,
      target: document
    };
    const { result } = renderHook(() => useKeysPressed(props));

    fireEvent.keyDown(document, {
      key: 'g',
      code: 'KeyG'
    });
    fireEvent.keyUp(document, {
      key: 'g',
      code: 'KeyG'
    });

    expect(result.current).toHaveLength(0);
  });
});
