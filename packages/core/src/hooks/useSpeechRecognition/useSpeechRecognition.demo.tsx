import { useState } from 'react';

import { useSpeechRecognition } from './useSpeechRecognition';

const SHARED_STYLES = {
  marginRight: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const Demo = () => {
  const [language, setLanguage] = useState<string>('en-US');
  const [continuous, setContinuous] = useState<boolean>(false);
  const [interimResults, setInterimResults] = useState<boolean>(false);
  const [maxAlternatives, setMaxAlternatives] = useState<number>(1);

  const { transcript, interimTranscript, error, listening, supported, start, stop, abort, reset } =
    useSpeechRecognition({
      language,
      continuous,
      interimResults,
      maxAlternatives
    });

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setLanguage(event.target.value);

  if (!supported) {
    return <p>Your browser does not support the Speech Recognition API.</p>;
  }

  return (
    <>
      <section style={{ marginBottom: '1rem', ...SHARED_STYLES, marginRight: 'unset' }}>
        <label style={SHARED_STYLES}>
          <input
            checked={language === 'en-US'}
            name='language'
            type='radio'
            value='en-US'
            onChange={handleLanguageChange}
          />
          English (US)
        </label>
        <label style={SHARED_STYLES}>
          <input
            checked={language === 'ru-RU'}
            name='language'
            type='radio'
            value='ru-RU'
            onChange={handleLanguageChange}
          />
          Russian
        </label>
        <label style={SHARED_STYLES}>
          <input
            checked={language === 'es-ES'}
            name='language'
            type='radio'
            value='es-ES'
            onChange={handleLanguageChange}
          />
          Spanish
        </label>
      </section>
      <section style={{ marginBottom: '1rem' }}>
        <label style={SHARED_STYLES}>
          <input
            checked={continuous}
            type='checkbox'
            onChange={() => setContinuous((prev) => !prev)}
          />
          Continuous
        </label>
        <label style={SHARED_STYLES}>
          <input
            checked={interimResults}
            type='checkbox'
            onChange={() => setInterimResults((prev) => !prev)}
          />
          Interim Results
        </label>
      </section>
      <section style={{ marginBottom: '1rem' }}>
        <label>
          Max Alternatives:&nbsp;
          <select
            value={maxAlternatives}
            onChange={(e) => setMaxAlternatives(Number(e.target.value))}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </label>
      </section>

      <section style={{ marginBottom: '1rem' }}>
        <button
          disabled={listening}
          style={{ marginRight: '0.5rem' }}
          type='button'
          onClick={start}
        >
          Start
        </button>
        <button
          disabled={!listening}
          style={{ marginRight: '0.5rem' }}
          type='button'
          onClick={stop}
        >
          Stop
        </button>
        <button
          disabled={!listening}
          style={{ marginRight: '0.5rem' }}
          type='button'
          onClick={abort}
        >
          Abort
        </button>
        <button disabled={continuous && listening} type='button' onClick={reset}>
          Reset
        </button>
      </section>

      <section>
        <h3>Status</h3>
        <p>
          <strong>Listening:</strong> {listening ? 'Yes' : 'No'}
        </p>
        {error && (
          <p style={{ color: 'red' }}>
            <strong>Error:</strong> {error.error ?? 'Unknown error'}
          </p>
        )}
      </section>

      <section>
        <h3>Transcript</h3>
        <p>
          <strong>Final:</strong> {transcript}
        </p>
        {interimResults && (
          <p>
            <strong>Interim:</strong> {interimTranscript}
          </p>
        )}
      </section>
    </>
  );
};

export default Demo;
