import { useEffect, useState } from 'react';

import { useLatest } from './useLatest';

const Demo = () => {
    const [count, setCount] = useState(0);
    const latestCount = useLatest(count);

    useEffect(() => {
        const interval = setInterval(() => setCount(count + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <p>Count: <code>{count}</code></p>
            <p>Latest count: <code>{latestCount}</code></p>
        </div>
    );
};

export default Demo;
