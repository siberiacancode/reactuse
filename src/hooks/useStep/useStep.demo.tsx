import { useStep } from './useStep';

const Step1 = () => <p>First step</p>;
const Step2 = () => <p>Second step</p>;
const Step3 = () => <p>Third step</p>;
const STEPS = [<Step1 key={1} />, <Step2 key={2} />, <Step3 key={3} />];

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
      <button disabled={isFirst} type='button' onClick={back}>
        Back
      </button>
      <button disabled={isLast} type='button' onClick={next}>
        Next
      </button>
      <button disabled={isFirst} type='button' onClick={reset}>
        Reset
      </button>
    </>
  );
};

export default Demo;
