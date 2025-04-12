import { useState } from 'react';

import { useSpeechSynthesis, useMount, useField } from '@siberiacancode/reactuse';

const Demo = () => {
    const textField = useField({ initialValue: 'Hello, everyone! Good morning!' });
    const pitchField = useField({ initialValue: 1 });
    const rateField = useField({ initialValue: 1 });
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [voice, setVoice] = useState<SpeechSynthesisVoice>();

    const text = textField.watch();
    const pitch = pitchField.watch();
    const rate = rateField.watch();

    const speechSynthesis = useSpeechSynthesis({
        text,
        voice,
        pitch,
        rate,
    });

    useMount(() => {
        if (!speechSynthesis.supported) return

        const timeout = setTimeout(() => {
            const voices = window.speechSynthesis.getVoices();
            setVoice(voices[0]);
            setVoices(voices);
        }, 100);

        return () => clearTimeout(timeout);

    });

    const play = () => {
        if (speechSynthesis.status === 'pause') {
            speechSynthesis.resume()
        } else {
            speechSynthesis.speak();
        }
    };

    if (!speechSynthesis.supported) return <p>Api not supported, make sure to check for compatibility with different browsers when using this <a target="_blank" rel="noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis">api</a></p>;

    return (
        <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
                <label className="font-bold mr-2">Spoken Text</label>
                <input
                    {...textField.register()}
                    type="text"
                />
            </div>

            <div className="flex gap-1 items-center">
                <label className="font-bold mr-2">Language</label>

                <select
                    disabled={speechSynthesis.playing}
                    value={voices.indexOf(voice as SpeechSynthesisVoice)}
                    onChange={(event) => setVoice(voices[parseInt(event.target.value)])}
                >
                    <option disabled>Select Language</option>
                    {voices.map((voice, index) => (
                        <option key={index} value={index}>
                            {`${voice.name} (${voice.lang})`}
                        </option>
                    ))}
                </select>

            </div>

            <div className="flex gap-1 items-center">
                <label className="font-bold mr-2">Pitch</label>

                <input
                    {...pitchField.register()}
                    disabled={speechSynthesis.playing}
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                />
            </div>

            <div className="flex gap-1 items-center">
                <label className="font-bold mr-2">Rate</label>
                <div className="mt-1 inline-flex">
                    <input
                        {...rateField.register()}
                        disabled={speechSynthesis.playing}
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                    />
                </div>
            </div>

            <div className="mt-2">
                <button
                    disabled={speechSynthesis.playing}
                    onClick={play}
                >
                    {speechSynthesis.status === 'pause' ? 'Resume' : 'Speak'}
                </button>
                <button disabled={!speechSynthesis.playing} className="orange" onClick={speechSynthesis.pause}>
                    Pause
                </button>
                <button disabled={!speechSynthesis.playing} className="red" onClick={speechSynthesis.stop}>
                    Stop
                </button>
            </div>
        </div>
    );
};

export default Demo;
