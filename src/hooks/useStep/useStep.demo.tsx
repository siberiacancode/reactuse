import { useStep } from './useStep';

const Step1 = () => <p>First step</p>;
const Step2 = () => <p>Second step</p>;
const Step3 = () => <p>Third step</p>;
const STEPS = [<Step1 />, <Step2 />, <Step3 />];

const Demo = () => {
  const { currentStep, isFirst, isLast, next, back, reset } = useStep(STEPS.length);
  const index = currentStep - 1;

  const StepComponent = STEPS[index];

  return (
    <>
      <p>
        Current step value: <code>{currentStep}</code>
      </p>
      <p>
        Is first step: <code>{String(isFirst)}</code>
      </p>
      <p>
        Is last step: <code>{String(isLast)}</code>
      </p>
      {StepComponent}
      <button type='button' disabled={isFirst} onClick={back}>
        Back
      </button>
      <button type='button' disabled={isLast} onClick={next}>
        Next
      </button>
      <button type='button' disabled={isFirst} onClick={reset}>
        Reset
      </button>
    </>
  );
};

export default Demo;
