import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useField } from './useField';

let input: HTMLInputElement;

beforeEach(() => {
  input = document.createElement('input');
});

const applyHandlers = (handlers: any) => {
  handlers.ref(input);
  input.onchange = handlers.onChange;
  input.onblur = handlers.onBlur;
};

it('Should use field', () => {
  const { result } = renderHook(useField);

  expect(result.current.dirty).toBeFalsy();
  expect(result.current.touched).toBeFalsy();
  expect(result.current.error).toBeUndefined();
  expect(result.current.ref.current).toBeNull();
  expect(result.current.getValue).toBeTypeOf('function');
  expect(result.current.setValue).toBeTypeOf('function');
  expect(result.current.reset).toBeTypeOf('function');
  expect(result.current.watch).toBeTypeOf('function');
  expect(result.current.focus).toBeTypeOf('function');
  expect(result.current.setError).toBeTypeOf('function');
  expect(result.current.clearError).toBeTypeOf('function');
  expect(result.current.register).toBeTypeOf('function');
  expect(result.current.getValue()).toBe('');
});

it('Should use field on server side', () => {
  const { result } = renderHookServer(useField);

  expect(result.current.dirty).toBeFalsy();
  expect(result.current.touched).toBeFalsy();
  expect(result.current.error).toBeUndefined();
  expect(result.current.ref.current).toBeNull();
  expect(result.current.getValue).toBeTypeOf('function');
  expect(result.current.setValue).toBeTypeOf('function');
  expect(result.current.reset).toBeTypeOf('function');
  expect(result.current.watch).toBeTypeOf('function');
  expect(result.current.focus).toBeTypeOf('function');
  expect(result.current.setError).toBeTypeOf('function');
  expect(result.current.clearError).toBeTypeOf('function');
  expect(result.current.register).toBeTypeOf('function');
  expect(result.current.getValue()).toBe('');
});

it('Should register input', () => {
  const { result } = renderHook(() => useField('initial'));

  act(() => applyHandlers(result.current.register()));

  expect(result.current.ref.current).toBe(input);
  expect(input.defaultValue).toBe('initial');
  expect(result.current.getValue()).toBe('initial');
});

it('Should correctly handle dirty state', async () => {
  const { result } = renderHook(useField);
  const handlers = result.current.register();

  act(() => applyHandlers(handlers));

  expect(result.current.dirty).toBeFalsy();

  act(() => {
    input.value = 'value';
    input.dispatchEvent(new Event('change'));
  });

  expect(result.current.dirty).toBeTruthy();

  act(() => {
    input.value = '';
    input.dispatchEvent(new Event('change'));
  });

  expect(result.current.dirty).toBeFalsy();
});

it('Should set touched on blur', async () => {
  const { result } = renderHook(useField);
  const handlers = result.current.register();

  act(() => applyHandlers(handlers));

  await act(() => input.dispatchEvent(new Event('blur')));

  expect(result.current.touched).toBeTruthy();
});

it('Should validate on blur', async () => {
  const { result } = renderHook(() =>
    useField('', {
      validateOnBlur: true
    })
  );
  const handlers = result.current.register({
    required: 'required'
  });

  act(() => applyHandlers(handlers));

  await act(() => input.dispatchEvent(new Event('blur')));

  expect(result.current.error).toBe('required');
});

it('Should validate on change and clear error after valid value', async () => {
  const { result } = renderHook(() =>
    useField('', {
      validateOnChange: true
    })
  );
  const handlers = result.current.register({
    minLength: {
      value: 3,
      message: 'min value is 3'
    }
  });

  act(() => applyHandlers(handlers));

  await act(() => {
    input.value = 'va';
    input.dispatchEvent(new Event('change'));
  });

  expect(result.current.getValue()).toBe('va');
  expect(result.current.error).toBe('min value is 3');

  await act(async () => {
    input.value = 'value';
    input.dispatchEvent(new Event('change'));
  });

  expect(result.current.getValue()).toBe('value');
  expect(result.current.error).toBeUndefined();
});

it('Should manually set error', () => {
  const { result } = renderHook(useField);

  act(() => result.current.setError('error'));
  expect(result.current.error).toBe('error');
});

it('Should manually clear error', () => {
  const { result } = renderHook(useField);

  act(() => result.current.setError('error'));
  expect(result.current.error).toBe('error');

  act(() => result.current.clearError());
  expect(result.current.error).toBeUndefined();
});

it('Should return reactive value on watch', async () => {
  const { result } = renderHook(useField);

  act(() => applyHandlers(result.current.register()));

  expect(result.current.watch()).toBe('');

  act(() => {
    input.value = 'value';
    input.dispatchEvent(new Event('change'));
  });

  expect(result.current.watch()).toBe('value');
});

it('Should reset field state', async () => {
  const { result } = renderHook(useField);
  const handlers = result.current.register();

  act(() => applyHandlers(handlers));

  await act(async () => {
    input.value = 'changed';
    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new Event('blur'));
    result.current.setError('error');
  });

  expect(result.current.getValue()).toBe('changed');
  expect(result.current.dirty).toBeTruthy();
  expect(result.current.touched).toBeTruthy();
  expect(result.current.error).toBe('error');

  act(() => result.current.reset());

  expect(result.current.getValue()).toBe('');
  expect(result.current.dirty).toBeFalsy();
  expect(result.current.touched).toBeFalsy();
  expect(result.current.error).toBeUndefined();
});

it('Should manually get value', () => {
  const { result } = renderHook(() => useField('value'));

  act(() => applyHandlers(result.current.register()));

  expect(result.current.getValue()).toBe('value');
});

it('Should manually set value', () => {
  const { result } = renderHook(() => useField<string>());

  act(() => applyHandlers(result.current.register()));

  expect(result.current.getValue()).toBe('');
  act(() => result.current.setValue('value'));
  expect(result.current.getValue()).toBe('value');
});

it('Should focus input', () => {
  const focusSpy = vi.spyOn(input, 'focus');
  const { result } = renderHook(useField);

  expect(focusSpy).not.toHaveBeenCalled();

  act(() => applyHandlers(result.current.register()));
  act(() => result.current.focus());

  expect(focusSpy).toHaveBeenCalledOnce();
});

it('Should initialize touched from options', () => {
  const { result } = renderHook(() =>
    useField('', {
      initialTouched: true
    })
  );

  expect(result.current.touched).toBeTruthy();
});

it('Should validate on mount', () => {
  const { result } = renderHook(() =>
    useField('', {
      validateOnMount: true
    })
  );
  const handlers = result.current.register({ required: 'required' });
  act(() => applyHandlers(handlers));

  expect(result.current.error).toBe('required');
});

it('Should auto focus input on register', () => {
  const focusSpy = vi.spyOn(input, 'focus');
  const { result } = renderHook(() =>
    useField('', {
      autoFocus: true
    })
  );

  expect(focusSpy).not.toHaveBeenCalled();

  act(() => applyHandlers(result.current.register()));

  expect(focusSpy).toHaveBeenCalledOnce();
});

it('Should validate all register params', async () => {
  const { result } = renderHook(() =>
    useField('', {
      validateOnChange: true
    })
  );
  const handlers = result.current.register({
    required: 'required',
    minLength: {
      value: 3,
      message: 'minLength'
    },
    maxLength: {
      value: 5,
      message: 'maxLength'
    },
    min: {
      value: 2,
      message: 'min'
    },
    max: {
      value: 4,
      message: 'max'
    },
    pattern: {
      value: /^[a-z]+$/,
      message: 'pattern'
    },
    validate: (value) => (value.includes('a') ? 'custom' : true)
  });

  act(() => applyHandlers(handlers));

  await act(async () => {
    input.value = '';
    input.dispatchEvent(new Event('change'));
  });
  expect(result.current.error).toBe('required');

  await act(async () => {
    input.value = 'ab';
    input.dispatchEvent(new Event('change'));
  });
  expect(result.current.error).toBe('minLength');

  await act(async () => {
    input.value = 'abcdef';
    input.dispatchEvent(new Event('change'));
  });
  expect(result.current.error).toBe('maxLength');

  await act(async () => {
    input.value = '1';
    input.dispatchEvent(new Event('change'));
  });
  expect(result.current.error).toBe('min');

  await act(async () => {
    input.value = '5';
    input.dispatchEvent(new Event('change'));
  });
  expect(result.current.error).toBe('max');

  await act(async () => {
    input.value = 'ab1';
    input.dispatchEvent(new Event('change'));
  });
  expect(result.current.error).toBe('pattern');

  await act(async () => {
    input.value = 'abc';
    input.dispatchEvent(new Event('change'));
  });
  expect(result.current.error).toBe('custom');
});
