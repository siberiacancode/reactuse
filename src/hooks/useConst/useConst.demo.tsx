import { useConst } from './useConst';

const Demo = () => {
    const mountTime = useConst(() => new Date().toTimeString())
    const obj = useConst({ a: Math.random() })

    return (
        <div>
            <p>Mount time: <code>{mountTime}</code></p>
            <p>Value from constant object: <code>{obj.a}</code></p>
        </div>
    )
};

export default Demo;
