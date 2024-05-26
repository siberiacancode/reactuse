import React from 'react';

/** The use step params */
interface UseStepParams {
  /** Initial value for step */
  initial: number;
  /** Maximum value for step */
  max: number;
}

/** The use step return type */
interface UseStepReturn {
  /** Counts of steps */
  counts: number;
  /** Current value of step */
  currentStep: number;
  /** Boolean value if current step is first */
  isFirst: boolean;
  /** Boolean value if current step is last */
  isLast: boolean;
  /** Go to next step */
  next: () => void;
  /** Go to back step */
  back: () => void;
  /** Reset current step to initial value */
  reset: () => void;
  /** Go to custom step */
  set: (value: number | 'last' | 'first') => void;
}

export const useStep = (params: number | UseStepParams): UseStepReturn => {
  const maxStep = typeof params === 'object' ? params.max : params;
  const initial = typeof params === 'object' ? params.initial : 1;

  const initialStep = React.useRef(initial);
  const [currentStep, setCurrentStep] = React.useState(initial);

  const isFirst = currentStep === 1;
  const isLast = currentStep === maxStep;

  const next = () => {
    if (isLast) return;
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const back = () => {
    if (isFirst) return;
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const reset = () => setCurrentStep(initialStep.current);

  const set = (value: number | 'last' | 'first') => {
    if (value === 'first') return setCurrentStep(initialStep.current);
    if (value === 'last') return setCurrentStep(maxStep);
    if (value >= maxStep) return setCurrentStep(maxStep);
    if (value <= 1) return setCurrentStep(1);
    setCurrentStep(value);
  };

  return {
    counts: maxStep,
    currentStep,
    isFirst,
    isLast,
    next,
    back,
    reset,
    set
  };
};
