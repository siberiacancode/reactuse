import { useDisplayMedia } from './useDisplayMedia';

const Demo = () => {
    const { sharing, supported, start, stop, ref } = useDisplayMedia();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4 justify-center items-center">
                <button
                    disabled={!supported}
                    type="button"
                    onClick={sharing ? stop : start}
                >
                    {sharing ? 'Stop Sharing' : 'Start Sharing'}
                </button>
            </div>

            <video
                muted
                playsInline
                ref={ref}
                className="w-full max-w-2xl border rounded"
                autoPlay
            />
        </div>
    );
};

export default Demo;
