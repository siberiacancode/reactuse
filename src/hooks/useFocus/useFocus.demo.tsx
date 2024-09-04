import { useFocus } from './useFocus';

const Demo = () => {
  const textFocus = useFocus<HTMLParagraphElement>();
  const inputFocus = useFocus<HTMLInputElement>({ initialFocus: true });

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `.demo:focus { opacity: 0.7; box-shadow: 0 0 2px 1px var(--vp-c-brand); } `
        }}
      />
      <p
        ref={textFocus.ref}
        className='demo'
        style={{ padding: '2px', borderRadius: '2px' }}
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
