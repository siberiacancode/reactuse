import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useForm } from './useForm';

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
  node.name = handlers.name;
  node.onchange = handlers.onChange;
  node.onblur = handlers.onBlur;
};

it('Should use form', () => {
  const { result } = renderHook(() => useForm({ initialValues: { name: '' } }));

  expect(result.current.dirty).toEqual({});
  expect(result.current.touched).toEqual({});
  expect(result.current.errors).toEqual({});
  expect(result.current.submitting).toBeFalsy();
  expect(result.current.getValue).toBeTypeOf('function');
  expect(result.current.getValues).toBeTypeOf('function');
  expect(result.current.setValue).toBeTypeOf('function');
  expect(result.current.reset).toBeTypeOf('function');
  expect(result.current.watch).toBeTypeOf('function');
  expect(result.current.focus).toBeTypeOf('function');
  expect(result.current.setError).toBeTypeOf('function');
  expect(result.current.clearErrors).toBeTypeOf('function');
  expect(result.current.register).toBeTypeOf('function');
  expect(result.current.handleSubmit).toBeTypeOf('function');
  expect(result.current.trigger).toBeTypeOf('function');
  expect(result.current.getValue('name')).toBe('');

  act(() => applyHandlers(result.current.register('name'), input));
});

it('Should use form on server side', () => {
  const { result } = renderHookServer(() => useForm({ initialValues: { name: '' } }));

  expect(result.current.dirty).toEqual({});
  expect(result.current.touched).toEqual({});
  expect(result.current.errors).toEqual({});
  expect(result.current.submitting).toBeFalsy();
  expect(result.current.getValue).toBeTypeOf('function');
  expect(result.current.getValues).toBeTypeOf('function');
  expect(result.current.setValue).toBeTypeOf('function');
  expect(result.current.reset).toBeTypeOf('function');
  expect(result.current.watch).toBeTypeOf('function');
  expect(result.current.focus).toBeTypeOf('function');
  expect(result.current.setError).toBeTypeOf('function');
  expect(result.current.clearErrors).toBeTypeOf('function');
  expect(result.current.register).toBeTypeOf('function');
  expect(result.current.handleSubmit).toBeTypeOf('function');
  expect(result.current.trigger).toBeTypeOf('function');
  expect(result.current.getValue('name')).toBe('');
});

it('Should register input', () => {
  const { result } = renderHook(() => useForm({ initialValues: { name: 'initial' } }));

  act(() => applyHandlers(result.current.register('name'), input));

  expect(input.defaultValue).toBe('initial');
  expect(input.name).toBe('name');
  expect(result.current.getValue('name')).toBe('initial');
});

it('Should correctly handle dirty state', () => {
  const { result } = renderHook(() => useForm({ initialValues: { name: '' } }));

  act(() => applyHandlers(result.current.register('name'), input));

  expect(result.current.dirty).toEqual({});

  act(() => {
    input.value = 'value';
    input.dispatchEvent(new Event('change'));
  });

  expect(result.current.dirty.name).toBeTruthy();

  act(() => {
    input.value = '';
    input.dispatchEvent(new Event('change'));
  });

  expect(result.current.dirty.name).toBeFalsy();
});

it('Should set touched on blur', async () => {
  const { result } = renderHook(() => useForm({ initialValues: { name: '' } }));

  act(() => applyHandlers(result.current.register('name'), input));

  await act(() => input.dispatchEvent(new Event('blur')));

  expect(result.current.touched.name).toBeTruthy();
});

it('Should validate on blur', async () => {
  const { result } = renderHook(() =>
    useForm({ initialValues: { name: '' }, validateOnBlur: true })
  );

  act(() => applyHandlers(result.current.register('name', { required: 'required' }), input));

  await act(() => input.dispatchEvent(new Event('blur')));

  expect(result.current.errors.name).toBe('required');
});

it('Should validate on change', async () => {
  const { result } = renderHook(() =>
    useForm({ initialValues: { name: '' }, validateOnChange: true })
  );

  act(() =>
    applyHandlers(
      result.current.register('name', { minLength: { value: 3, message: 'min value is 3' } }),
      input
    )
  );

  await act(async () => {
    input.value = 'va';
    input.dispatchEvent(new Event('change'));
  });

  expect(result.current.getValue('name')).toBe('va');
  expect(result.current.errors.name).toBe('min value is 3');

  await act(async () => {
    input.value = 'value';
    input.dispatchEvent(new Event('change'));
  });

  expect(result.current.getValue('name')).toBe('value');
  expect(result.current.errors.name).toBeUndefined();
});

it('Should call register change handler after internal change handler', async () => {
  const onChange = vi.fn();
  const { result } = renderHook(() => useForm({ initialValues: { name: '' } }));

  act(() => applyHandlers(result.current.register('name', { onChange }), input));

  await act(async () => {
    input.value = 'value';
    input.dispatchEvent(new Event('change'));
  });

  expect(onChange).toHaveBeenCalledOnce();
  expect(result.current.dirty.name).toBeTruthy();
});

it('Should call register blur handler after internal blur handler', async () => {
  const onBlur = vi.fn();
  const { result } = renderHook(() => useForm({ initialValues: { name: '' } }));

  act(() => applyHandlers(result.current.register('name', { onBlur }), input));

  await act(async () => input.dispatchEvent(new Event('blur')));

  expect(onBlur).toHaveBeenCalledOnce();
  expect(result.current.touched.name).toBeTruthy();
});

it('Should manually set error', () => {
  const { result } = renderHook(() => useForm({ initialValues: { name: '' } }));

  act(() => result.current.setError('name', 'error'));

  expect(result.current.errors.name).toBe('error');
});

it('Should manually clear error', () => {
  const { result } = renderHook(() => useForm({ initialValues: { name: '', email: '' } }));

  act(() => {
    result.current.setError('name', 'name error');
    result.current.setError('email', 'email error');
  });

  act(() => result.current.clearErrors('name'));

  expect(result.current.errors.name).toBeUndefined();
  expect(result.current.errors.email).toBe('email error');
});

it('Should manually clear all errors', () => {
  const { result } = renderHook(() => useForm({ initialValues: { name: '', email: '' } }));

  act(() => {
    result.current.setError('name', 'name error');
    result.current.setError('email', 'email error');
  });

  act(() => result.current.clearErrors());

  expect(result.current.errors).toEqual({});
});

it('Should return reactive values on watch', () => {
  const { result } = renderHook(() => useForm({ initialValues: { name: '' } }));

  act(() => applyHandlers(result.current.register('name'), input));

  expect(result.current.watch()).toEqual({ name: '' });

  act(() => {
    input.value = 'value';
    input.dispatchEvent(new Event('change'));
  });

  expect(result.current.watch()).toEqual({ name: 'value' });
});

it('Should reset form state', async () => {
  const { result } = renderHook(() => useForm({ initialValues: { name: '' } }));

  act(() => applyHandlers(result.current.register('name'), input));

  await act(async () => {
    input.value = 'changed';
    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new Event('blur'));
    result.current.setError('name', 'error');
  });

  expect(result.current.getValue('name')).toBe('changed');
  expect(result.current.dirty.name).toBeTruthy();
  expect(result.current.touched.name).toBeTruthy();
  expect(result.current.errors.name).toBe('error');

  act(() => result.current.reset());

  expect(result.current.getValue('name')).toBe('');
  expect(result.current.dirty).toEqual({});
  expect(result.current.touched).toEqual({});
  expect(result.current.errors).toEqual({});
});

it('Should reset form with new initial values', () => {
  const { result } = renderHook(() => useForm({ initialValues: { name: 'initial' } }));

  act(() => applyHandlers(result.current.register('name'), input));

  act(() => result.current.reset({ name: 'next' }));

  expect(result.current.getValue('name')).toBe('next');
});

it('Should manually get value', () => {
  const { result } = renderHook(() => useForm({ initialValues: { name: 'value' } }));

  act(() => applyHandlers(result.current.register('name'), input));

  expect(result.current.getValue('name')).toBe('value');
});

it('Should manually set value', () => {
  const { result } = renderHook(() => useForm({ initialValues: { name: '' } }));

  act(() => applyHandlers(result.current.register('name'), input));

  expect(result.current.getValue('name')).toBe('');
  act(() => result.current.setValue('name', 'value'));
  expect(result.current.getValue('name')).toBe('value');
});

it('Should focus field', () => {
  const focusSpy = vi.spyOn(input, 'focus');
  const { result } = renderHook(() => useForm({ initialValues: { name: '' } }));

  expect(focusSpy).not.toHaveBeenCalled();

  act(() => applyHandlers(result.current.register('name'), input));
  act(() => result.current.focus('name'));

  expect(focusSpy).toHaveBeenCalledOnce();
});

it('Should auto focus field on register', () => {
  const focusSpy = vi.spyOn(input, 'focus');
  const { result } = renderHook(() => useForm({ initialValues: { name: '' }, autoFocus: 'name' }));

  expect(focusSpy).not.toHaveBeenCalled();

  act(() => applyHandlers(result.current.register('name'), input));

  expect(focusSpy).toHaveBeenCalledOnce();
});

it('Should trigger validation manually', async () => {
  const { result } = renderHook(() => useForm({ initialValues: { name: '' } }));

  act(() => applyHandlers(result.current.register('name', { required: 'required' }), input));

  await act(async () => {
    const valid = await result.current.trigger('name');
    expect(valid!).toBeFalsy();
  });

  expect(result.current.errors.name).toBe('required');
});

it('Should focus first invalid field on trigger', async () => {
  const focusSpy = vi.spyOn(input, 'focus');
  const { result } = renderHook(() => useForm({ initialValues: { name: '' } }));

  act(() => applyHandlers(result.current.register('name', { required: 'required' }), input));

  await act(async () => {
    await result.current.trigger('name', { shouldFocus: true });
  });

  expect(focusSpy).toHaveBeenCalledOnce();
});

it('Should submit valid form', async () => {
  const onValid = vi.fn();
  const preventDefault = vi.fn();

  const { result } = renderHook(() => useForm({ initialValues: { name: '' } }));

  act(() => applyHandlers(result.current.register('name', { required: 'required' }), input));

  await act(async () => {
    input.value = 'value';
    input.dispatchEvent(new Event('change'));
  });

  await act(async () => {
    await result.current.handleSubmit(onValid)({ preventDefault } as any);
  });

  expect(preventDefault).toHaveBeenCalledOnce();
  expect(onValid).toHaveBeenCalledOnce();
  expect(result.current.submitting).toBeFalsy();
});

it('Should not submit invalid form', async () => {
  const onValid = vi.fn();
  const onInvalid = vi.fn();
  const { result } = renderHook(() => useForm({ initialValues: { name: '' } }));

  act(() => applyHandlers(result.current.register('name', { required: 'required' }), input));

  await act(async () => {
    await result.current.handleSubmit(onValid, onInvalid)();
  });

  expect(onValid).not.toHaveBeenCalled();
  expect(onInvalid).toHaveBeenCalledOnce();
  expect(result.current.errors.name).toBe('required');
});

it('Should touch all fields on submit', async () => {
  const { result } = renderHook(() => useForm({ initialValues: { name: '' } }));

  act(() => applyHandlers(result.current.register('name'), input));

  await act(async () => {
    await result.current.handleSubmit(vi.fn())();
  });

  expect(result.current.touched).toEqual({ name: true });
});

it('Should validate on mount', async () => {
  const { result } = renderHook(() =>
    useForm({ initialValues: { name: '' }, validateOnMount: true })
  );

  await act(async () => {
    applyHandlers(result.current.register('name', { required: 'required' }), input);
  });

  expect(result.current.errors.name).toBe('required');
});

it('Should not validate without rules', async () => {
  const { result } = renderHook(() =>
    useForm({ initialValues: { name: '' }, validateOnChange: true })
  );

  act(() => applyHandlers(result.current.register('name'), input));

  await act(async () => {
    input.value = 'value';
    input.dispatchEvent(new Event('change'));
  });

  expect(result.current.errors.name).toBeUndefined();
});

it('Should validate all register params', async () => {
  const { result } = renderHook(() =>
    useForm({ initialValues: { name: '' }, validateOnChange: true })
  );

  act(() =>
    applyHandlers(
      result.current.register('name', {
        required: 'required',
        minLength: { value: 3, message: 'minLength' },
        maxLength: { value: 5, message: 'maxLength' },
        min: { value: 2, message: 'min' },
        max: { value: 4, message: 'max' },
        pattern: { value: /^[a-z]+$/, message: 'pattern' },
        validate: (value) => (value.includes('a') ? 'custom' : true)
      }),
      input
    )
  );

  await act(async () => {
    input.value = '';
    input.dispatchEvent(new Event('change'));
  });
  expect(result.current.errors.name).toBe('required');

  await act(async () => {
    input.value = 'ab';
    input.dispatchEvent(new Event('change'));
  });
  expect(result.current.errors.name).toBe('minLength');

  await act(async () => {
    input.value = 'abcdef';
    input.dispatchEvent(new Event('change'));
  });
  expect(result.current.errors.name).toBe('maxLength');

  await act(async () => {
    input.value = '1';
    input.dispatchEvent(new Event('change'));
  });
  expect(result.current.errors.name).toBe('min');

  await act(async () => {
    input.value = '5';
    input.dispatchEvent(new Event('change'));
  });
  expect(result.current.errors.name).toBe('max');

  await act(async () => {
    input.value = 'ab1';
    input.dispatchEvent(new Event('change'));
  });
  expect(result.current.errors.name).toBe('pattern');

  await act(async () => {
    input.value = 'abc';
    input.dispatchEvent(new Event('change'));
  });
  expect(result.current.errors.name).toBe('custom');
});

it('Should validate with resolver', async () => {
  const resolver = vi.fn(async (values: { name: string }) => ({
    values,
    errors: { name: 'required' }
  }));
  const { result } = renderHook(() => useForm({ initialValues: { name: '' }, resolver }));

  await act(async () => await result.current.trigger());

  expect(result.current.errors.name).toBe('required');
});

it('Should submit parsed values from resolver', async () => {
  const onValid = vi.fn();
  const resolver = async (values: { age: string }) => ({
    values: { age: Number(values.age) } as any,
    errors: {}
  });
  const { result } = renderHook(() => useForm({ initialValues: { age: '18' }, resolver }));

  act(() => applyHandlers(result.current.register('age'), input));

  await act(async () => {
    await result.current.handleSubmit(onValid)();
  });

  expect(onValid.mock.calls[0][0]).toEqual({ age: 18 });
});

it('Should clear resolver error after valid value', async () => {
  const resolver = async (values: { name: string }) => ({
    values,
    errors: values.name ? {} : { name: 'required' }
  });
  const { result } = renderHook(() =>
    useForm({ initialValues: { name: '' }, resolver, validateOnChange: true })
  );

  act(() => applyHandlers(result.current.register('name'), input));

  await act(async () => {
    input.dispatchEvent(new Event('change'));
  });
  expect(result.current.errors.name).toBe('required');

  await act(async () => {
    input.value = 'value';
    input.dispatchEvent(new Event('change'));
  });
  expect(result.current.errors.name).toBeUndefined();
});

FIELDS.forEach((field) =>
  describe(field.name, () => {
    let node: any;

    beforeEach(() => {
      node = field.create();
    });

    it('Should initialize from initial values', () => {
      const { result } = renderHook(() => useForm({ initialValues: { field: field.initial } }));

      act(() => applyHandlers(result.current.register('field'), node));

      expect(result.current.getValue('field')).toBe(field.initial);
    });

    it('Should manually set value', () => {
      const { result } = renderHook(() => useForm({ initialValues: { field: field.initial } }));

      act(() => applyHandlers(result.current.register('field'), node));
      act(() => result.current.setValue('field', field.next));

      expect(field.read(node)).toBe(field.next);
      expect(result.current.getValue('field')).toBe(field.next);
    });

    it('Should read value after change', () => {
      const { result } = renderHook(() => useForm({ initialValues: { field: field.initial } }));

      act(() => applyHandlers(result.current.register('field'), node));

      act(() => {
        field.write(node, field.next);
        node.dispatchEvent(new Event('change'));
      });

      expect(result.current.getValue('field')).toBe(field.next);
    });

    it('Should handle dirty state', () => {
      const { result } = renderHook(() => useForm({ initialValues: { field: field.initial } }));

      act(() => applyHandlers(result.current.register('field'), node));

      act(() => {
        field.write(node, field.next);
        node.dispatchEvent(new Event('change'));
      });
      expect(result.current.dirty.field).toBeTruthy();

      act(() => {
        field.write(node, field.initial);
        node.dispatchEvent(new Event('change'));
      });
      expect(result.current.dirty.field).toBeFalsy();
    });

    it('Should not reinitialize node on rerender', () => {
      const { result, rerender } = renderHook(() =>
        useForm({ initialValues: { field: field.initial } })
      );

      act(() => applyHandlers(result.current.register('field'), node));
      act(() => result.current.setValue('field', field.next));

      rerender();
      act(() => applyHandlers(result.current.register('field'), node));

      expect(result.current.getValue('field')).toBe(field.next);
    });

    it('Should reset to initial value', () => {
      const { result } = renderHook(() => useForm({ initialValues: { field: field.initial } }));

      act(() => applyHandlers(result.current.register('field'), node));
      act(() => result.current.setValue('field', field.next));
      act(() => result.current.reset());

      expect(result.current.getValue('field')).toBe(field.initial);
    });
  })
);
