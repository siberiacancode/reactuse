import { useCounter } from '../useCounter/useCounter';
import { useDoubleClick } from './useDoubleClick';

const Demo = () => {
    const counter = useCounter();
    const doubleClickRef = useDoubleClick<HTMLButtonElement>(() => counter.inc());

    return (
        <>
            <p>
                Double clicked <code>{counter.value}</code> times
            </p>
            <button ref={doubleClickRef} type="button">
                Double click me
            </button>
        </>
    );
};

export default Demo;