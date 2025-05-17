import { useFocus } from '@siberiacancode/reactuse';

const Demo = () => {
  const textFocus = useFocus<HTMLParagraphElement>();
  const inputFocus = useFocus<HTMLInputElement>({ initialValue: true });

  return (
    <>
      <p
        ref={textFocus.ref}
        className='p-1 focus:rounded-sm focus:opacity-70 focus:shadow-[0_0_2px_1px_var(--vp-c-brand)]'
        tabIndex={0}
      >
        Paragraph that can be focused
      </p>
      <input ref={inputFocus.ref} type='text' />
      <button type='button' onClick={textFocus.focus}>
        Focus text
      </button>
      <button type='button' onClick={inputFocus.focus}>
        Focus input
      </button>
    </>
  );
};

export default Demo;
