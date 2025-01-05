import { Fragment } from 'react';

import { useWizard } from './useWizard';

interface Step1Props {
  onNext: () => void;
}
const Step1 = ({ onNext }: Step1Props) => (
  <>
    <p>First step</p>
    <button type='button' onClick={onNext}>
      Next
    </button>
  </>
);
interface Step2Props {
  onBack: () => void;
  onNext: () => void;
}
const Step2 = ({ onNext, onBack }: Step2Props) => (
  <>
    <p>Second step</p>
    <button type='button' onClick={onNext}>
      Next
    </button>
    <button type='button' onClick={onBack}>
      Back
    </button>
  </>
);
const Step3 = () => <p>Third step</p>;

const Demo = () => {
  const wizard = useWizard([
    {
      id: 'step1',
      nodes: ['step2', 'step3']
    },
    {
      id: 'step2',
      nodes: ['step3']
    },
    {
      id: 'step3'
    }
  ]);

  return (
    <>
      <p>
        Current step id: <code>{wizard.currentStepId}</code>
      </p>
      <p>
        History:{' '}
        {wizard.history.map((stepId) => (
          <Fragment key={stepId}>
            <code>{stepId}</code>{' '}
          </Fragment>
        ))}
      </p>

      <br />

      {wizard.currentStepId === 'step1' && (
        <Step1
          onNext={() => {
            const skipSecond = Math.random() > 0.5;
            if (skipSecond) return wizard.set('step3');
            wizard.set('step2');
          }}
        />
      )}
      {wizard.currentStepId === 'step2' && (
        <Step2 onBack={wizard.back} onNext={() => wizard.set('step3')} />
      )}
      {wizard.currentStepId === 'step3' && <Step3 />}

      <button type='button' onClick={wizard.reset}>
        Reset
      </button>
    </>
  );
};

export default Demo;
