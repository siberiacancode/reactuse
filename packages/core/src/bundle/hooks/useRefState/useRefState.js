import { useState } from 'react';
const createRefState = (initialValue, setState) => {
    let temp = initialValue;
    function ref(value) {
        if (temp === value)
            return;
        temp = value;
        setState(temp);
    }
    Object.defineProperty(ref, 'current', {
        get() {
            return temp;
        },
        set(value) {
            if (temp === value)
                return;
            temp = value;
            setState(temp);
        },
        configurable: true,
        enumerable: true
    });
    return ref;
};
/**
 * @name useRefState
 * @description - Hook that returns the state reference of the value
 * @category Utilities
 *
 * @template Value The type of the value
 * @param {Value} [initialValue] The initial value
 * @returns {StateRef<Value>} The current value
 *
 * @example
 * const internalRefState = useRefState();
 */
export const useRefState = (initialValue) => {
    const [state, setState] = useState(initialValue);
    const [ref] = useState(() => createRefState(initialValue, setState));
    ref.state = state;
    return ref;
};
