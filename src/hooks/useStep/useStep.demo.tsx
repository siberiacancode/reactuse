import React from 'react';

import { useStep } from './useStep';

function Step1() {
  return <p>This is Step 1</p>;
}

function Step2() {
  return <p>This is Step 2</p>;
}

function Step3() {
  return <p>This is Step 3</p>;
}

const Demo = () => {
  const steps = [<Step1 />, <Step2 />, <Step3 />];
  const { currentStep, isFirstStep, isLastStep, nextStep, prevStep, resetStep } = useStep({ max: steps.length });
  const CurrentStepComponent = steps[currentStep];

  return (
    <>
      <p>Is First Step – {isFirstStep}</p>
      <p>Is Last Step – {isLastStep}</p>
      <CurrentStepComponent />
      <button
        disabled={isLastStep}
        onClick={nextStep}
      >
        To Next Step
      </button>
      <button
        disabled={isFirstStep}
        onClick={prevStep}
      >
        To Previous Step
      </button>
      <button
        disabled={isFirstStep}
        onClick={resetStep}
      >
        To Initial Step
      </button>
    </>
  );
};

export default Demo;
