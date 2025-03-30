import type { ChangeEvent } from 'react';
import { useState } from 'react';

import { useSpeechRecognition } from './useSpeechRecognition';
import { useDidUpdate } from '../useDidUpdate/useDidUpdate';

const COLORS = ['aqua', 'azure', 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow', 'transparent']
const GRAMMAR = `#JSGF V1.0; grammar colors; public <color> = ${COLORS.join(' | ')} ;`
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
const speechGrammarList = new SpeechGrammarList()
speechGrammarList.addFromString(GRAMMAR, 1)

const Demo = () => {
  const [color, setColor] = useState<string | undefined>(undefined);
  const [language, setLanguage] = useState('en-US');

  const speechRecognition =
    useSpeechRecognition({
      language,
      continuous: true,
      grammars: speechGrammarList
    });

  useDidUpdate(() => {
    for (const word of speechRecognition.transcript.toLowerCase().split(' ').reverse()) {
      if (COLORS.includes(word)) {
        setColor(word);
        break;
      }
    }
  }, [speechRecognition.transcript]);

  const onLanguageChange = (event: ChangeEvent<HTMLInputElement>) =>
    setLanguage(event.target.value);

  if (!speechRecognition.supported) {
    return <p>Your browser does not support the Speech Recognition API</p>;
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            checked={language === 'en-US'}
            name='language'
            type='radio'
            value='en-US'
            onChange={onLanguageChange}
          />
          English (US)
        </label>
        <label className="flex items-center gap-2">
          <input
            checked={language === 'fr'}
            name='language'
            type='radio'
            value='fr'
            onChange={onLanguageChange}
          />
          French
        </label>
        <label className="flex items-center gap-2">
          <input
            checked={language === 'es'}
            name='language'
            type='radio'
            value='es'
            onChange={onLanguageChange}
          />
          Spanish
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type='button'
          onClick={() => speechRecognition.toggle()}
        >
          {!speechRecognition.listening ? 'Press and speak' : 'Stop'}
        </button>
      </div>

      {speechRecognition.listening && (
        <section>
          {language === 'en-US' && (
            <>
              <p>
                Please say a color
              </p>
              <p className="text-sm text-gray-500">
                try: <code>aqua</code>, <code>azure</code>, <code>beige</code>, <code>bisque</code>
              </p>
            </>
          )}
          {language === 'fr' && (
            <>
              <p>
                Parlez français
              </p>
            </>
          )}
          {language === 'es' && (
            <>
              <p>
                Habla en español
              </p>
            </>
          )}
          <p className="text-sm text-gray-500" style={{ color }}>
            {speechRecognition.transcript}
          </p>
        </section>
      )}
    </>
  );
};

export default Demo;
