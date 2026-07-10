import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useField } from './useField';

interface FieldFixture {
  initial: any;
  name: string;
  next: any;
  create: () => HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  read: (node: any) => any;
  write: (node: any, value: any) => void;
}

const FIELDS: FieldFixture[] = [
  {
    name: 'text input',
    initial: 'initial',
    next: 'next',
    create: () => document.createElement('input'),
    read: (node) => node.value,
    write: (node, value) => {
      node.value = value;
    }
  },
  {
    name: 'textarea',
    initial: 'initial',
    next: 'next',
    create: () => document.createElement('textarea'),
    read: (node) => node.value,
    write: (node, value) => {
      node.value = value;
    }
  },
  {
    name: 'select',
    initial: 'ru',
    next: 'en',
    create: () => {
      const select = document.createElement('select');
      ['ru', 'en'].forEach((value) => {
        const option = document.createElement('option');
        option.value = value;
        select.append(option);
      });
      return select;
    },
    read: (node) => node.value,
    write: (node, value) => {
      node.value = value;
    }
  },
  {
    name: 'checkbox',
    initial: false,
    next: true,
    create: () => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      return input;
    },
    read: (node) => node.checked,
    write: (node, value) => {
      node.checked = value;
    }
  }
];

let input: HTMLInputElement;

beforeEach(() => {
  input = document.createElement('input');
});

const applyHandlers = (handlers: any, node: HTMLInputElement) => {
  handlers.ref(node);
  node.onchange = handlers.onChange;
  node.onblur = handlers.onBlur;
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

  act(() => applyHandlers(result.current.register(), input));
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

  act(() => applyHandlers(result.current.register(), input));
});

it('Should register input', () => {
  const { result } = renderHook(() => useField('initial'));

  act(() => applyHandlers(result.current.register(), input));

  expect(result.current.ref.current).toBe(input);
  expect(input.defaultValue).toBe('initial');
  expect(result.current.getValue()).toBe('initial');
});

it('Should correctly handle dirty state', async () => {
  const { result } = renderHook(useField);
  const handlers = result.current.register();

  act(() => applyHandlers(handlers, input));

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

  act(() => applyHandlers(handlers, input));

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

  act(() => applyHandlers(handlers, input));

  await act(() => input.dispatchEvent(new Event('blur')));

  expect(result.current.error).toBe('required');
});

it('Should validate on change ', async () => {
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

  act(() => applyHandlers(handlers, input));

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

it('Should call register change handler after internal change handler', async () => {
  const onChange = vi.fn();
  const { result } = renderHook(() => useField(''));
  const handlers = result.current.register({
    onChange
  });

  act(() => applyHandlers(handlers, input));

  await act(async () => {
    input.value = 'value';
    input.dispatchEvent(new Event('change'));
  });

  expect(onChange).toHaveBeenCalledOnce();
  expect(result.current.dirty).toBeTruthy();
});

it('Should call register blur handler after internal blur handler', async () => {
  const onBlur = vi.fn();
  const { result } = renderHook(() => useField(''));
  const handlers = result.current.register({
    onBlur
  });

  act(() => applyHandlers(handlers, input));

  await act(async () => {
    input.dispatchEvent(new Event('blur'));
  });

  expect(onBlur).toHaveBeenCalledOnce();
  expect(result.current.touched).toBeTruthy();
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

  act(() => applyHandlers(result.current.register(), input));

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

  act(() => applyHandlers(handlers, input));

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

  act(() => applyHandlers(result.current.register(), input));

  expect(result.current.getValue()).toBe('value');
});

it('Should manually set value', () => {
  const { result } = renderHook(() => useField<string>());

  act(() => applyHandlers(result.current.register(), input));

  expect(result.current.getValue()).toBe('');
  act(() => result.current.setValue('value'));
  expect(result.current.getValue()).toBe('value');
});

it('Should focus field', () => {
  const focusSpy = vi.spyOn(input, 'focus');
  const { result } = renderHook(useField);

  expect(focusSpy).not.toHaveBeenCalled();

  act(() => applyHandlers(result.current.register(), input));
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
  act(() => applyHandlers(handlers, input));

  expect(result.current.error).toBe('required');
});

it('Should validate with rules from options', async () => {
  const { result } = renderHook(() => useField('', { validateOnBlur: true, required: 'required' }));

  act(() => applyHandlers(result.current.register(), input));
  await act(() => input.dispatchEvent(new Event('blur')));

  expect(result.current.error).toBe('required');
});

it('Should override options rules with register params', async () => {
  const { result } = renderHook(() =>
    useField('', { validateOnBlur: true, required: 'from options' })
  );

  act(() => applyHandlers(result.current.register({ required: 'from register' }), input));
  await act(() => input.dispatchEvent(new Event('blur')));

  expect(result.current.error).toBe('from register');
});

it('Should override options handlers with register handlers', async () => {
  const optionsOnChange = vi.fn();
  const registerOnChange = vi.fn();
  const { result } = renderHook(() => useField('', { onChange: vi.fn() }));

  act(() => applyHandlers(result.current.register({ onChange: registerOnChange }), input));

  await act(async () => {
    input.value = 'value';
    input.dispatchEvent(new Event('change'));
  });

  expect(optionsOnChange).not.toHaveBeenCalled();
  expect(registerOnChange).toHaveBeenCalledOnce();
});

it('Should merge options and register rules', async () => {
  const { result } = renderHook(() =>
    useField('', { validateOnChange: true, required: 'required' })
  );

  act(() =>
    applyHandlers(result.current.register({ minLength: { value: 3, message: 'minLength' } }), input)
  );

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
});

it('Should not validate without rules', async () => {
  const { result } = renderHook(() => useField('', { validateOnChange: true }));

  act(() => applyHandlers(result.current.register(), input));

  await act(async () => {
    input.value = 'value';
    input.dispatchEvent(new Event('change'));
  });

  expect(result.current.error).toBeUndefined();
});

it('Should validate on mount with rules from options', () => {
  const { result } = renderHook(() =>
    useField('', { validateOnMount: true, required: 'required' })
  );

  act(() => applyHandlers(result.current.register(), input));

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

  act(() => applyHandlers(result.current.register(), input));

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

  act(() => applyHandlers(handlers, input));

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

FIELDS.forEach((field) =>
  describe(field.name, () => {
    let node: any;

    beforeEach(() => {
      node = field.create();
    });

    it('Should initialize from initial value', () => {
      const { result } = renderHook(() => useField(field.initial));

      act(() => applyHandlers(result.current.register(), node));

      expect(result.current.getValue()).toBe(field.initial);
    });

    it('Should manually set value', () => {
      const { result } = renderHook(() => useField(field.initial));

      act(() => applyHandlers(result.current.register(), node));
      act(() => result.current.setValue(field.next));

      expect(field.read(node)).toBe(field.next);
      expect(result.current.getValue()).toBe(field.next);
    });

    it('Should read value after change', () => {
      const { result } = renderHook(() => useField(field.initial));

      act(() => applyHandlers(result.current.register(), node));

      act(() => {
        field.write(node, field.next);
        node.dispatchEvent(new Event('change'));
      });

      expect(result.current.getValue()).toBe(field.next);
    });

    it('Should handle dirty state', () => {
      const { result } = renderHook(() => useField(field.initial));

      act(() => applyHandlers(result.current.register(), node));

      act(() => {
        field.write(node, field.next);
        node.dispatchEvent(new Event('change'));
      });
      expect(result.current.dirty).toBeTruthy();

      act(() => {
        field.write(node, field.initial);
        node.dispatchEvent(new Event('change'));
      });
      expect(result.current.dirty).toBeFalsy();
    });

    it('Should not reinitialize node on rerender', () => {
      const { result, rerender } = renderHook(() => useField(field.initial));

      act(() => applyHandlers(result.current.register(), node));
      act(() => result.current.setValue(field.next));

      rerender();
      act(() => applyHandlers(result.current.register(), node));

      expect(result.current.getValue()).toBe(field.next);
    });

    it('Should reset to initial value', () => {
      const { result } = renderHook(() => useField(field.initial));

      act(() => applyHandlers(result.current.register(), node));
      act(() => result.current.setValue(field.next));
      act(() => result.current.reset());

      expect(result.current.getValue()).toBe(field.initial);
    });
  })
);
