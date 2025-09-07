import { useControllableState, useDisclosure } from '@siberiacancode/reactuse';

interface CollapseProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  title: string;
  onToggle?: (isOpen: boolean) => void;
}

const Collapse = ({ title, children, isOpen, defaultOpen = false, onToggle }: CollapseProps) => {
  const [isOpenState, setIsOpenState] = useControllableState({
    value: isOpen,
    defaultValue: defaultOpen,
    onChange: onToggle
  });

  return (
    <div
      className='cursor-pointer rounded border border-2 border-dashed border-[var(--vp-c-brand-2)] transition-colors duration-300 hover:border-[var(--vp-c-brand-1)]'
      onClick={() => setIsOpenState(!isOpenState)}
    >
      <div className='flex items-center justify-between p-3'>
        <div className='font-semibold'>{title}</div>
        <div>{isOpenState ? '-' : '+'}</div>
      </div>

      {isOpenState && <div className='p-3'>{children}</div>}
    </div>
  );
};

const Demo = () => {
  const controlledCollapse = useDisclosure(false);

  return (
    <>
      <Collapse defaultOpen={true} title='Uncontrolled Collapse'>
        <p>
          <code>Uncontrolled</code> - component manages its own state internally. You provide
          initial value via defaultOpen prop.
        </p>
      </Collapse>

      <br />

      <Collapse
        isOpen={controlledCollapse.opened}
        title='Controlled Collapse'
        onToggle={controlledCollapse.toggle}
      >
        <p>
          <code>Controlled</code> - parent component controls the state via isOpen prop and receives
          updates through onToggle callback.
        </p>
      </Collapse>

      <div className='mt-4 flex flex-wrap gap-1'>
        <button type='button' onClick={controlledCollapse.toggle}>
          {controlledCollapse.opened ? 'Close' : 'Open'}
        </button>

        <button type='button' onClick={controlledCollapse.toggle}>
          Toggle
        </button>
      </div>
    </>
  );
};

export default Demo;
