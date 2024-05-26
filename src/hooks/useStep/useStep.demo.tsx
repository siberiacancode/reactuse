import React from 'react';

import { useStep } from './useStep';

const Step1 = () => {
  return <p>This is Step 1</p>;
};

const Step2 = () => {
  return <p>This is Step 2</p>;
};

const Step3 = () => {
  return <p>This is Step 3</p>;
};

const Demo = () => {
  const steps = [<Step1 />, <Step2 />, <Step3 />];
  const { currentStep, isFirst, isLast, next, back, reset } = useStep(steps.length);
  const CurrentStepComponent = steps[currentStep - 1];

  return (
    <>
      <p>Current Step Value – {currentStep}</p>
      <p>Is First Step – {isFirst}</p>
      <p>Is Last Step – {isLast}</p>
      {CurrentStepComponent}
      <button type='button' disabled={isLast} onClick={next}>
        To Next Step
      </button>
      <button type='button' disabled={isFirst} onClick={back}>
        To Previous Step
      </button>
      <button type='button' disabled={isFirst} onClick={reset}>
        To Initial Step
      </button>
    </>
  );
};

export default Demo;
