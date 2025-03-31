import { useCounter } from '../useCounter/useCounter';
import { useDoubleClick } from './useDoubleClick';

const Demo = () => {
    const counter = useCounter();
    const doubleClick = useDoubleClick<HTMLButtonElement>(() => counter.inc());

    return (
        <>
            <p>
                Double clicked: <code>{counter.value}</code> times
            </p>
            <button ref={doubleClick.ref} type="button">
                Double click me
            </button>
        </>
    );
};

export default Demo;