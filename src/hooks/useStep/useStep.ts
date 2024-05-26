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

const FIRST_STEP_VALUE = 1;

/**
 * @name useStep
 * @description Helpers for building steppers
 *
 * @param {number} [params] Maximum step value
 *
 * @returns {UseStepReturn} An object contains variables and functions to change the step
 *
 * @example Params as number
 * const steps = [...];
 * const step = useStep(steps.length);
 * const StepComponent = steps[step.currentStep - 1];
 *
 * @example Params as object
 * const steps = [...];
 * const step = useStep({ initial: 0, max: steps.length - 1 });
 * const StepComponent = steps[step.currentStep];
 */
export const useStep = (params: number | UseStepParams): UseStepReturn => {
  const isParamsObject = typeof params === 'object';
  if (isParamsObject && params.initial < FIRST_STEP_VALUE) {
    throw new Error(`Initial cannot be less than ${FIRST_STEP_VALUE}`);
  }

  const initial = isParamsObject ? params.initial : FIRST_STEP_VALUE;
  const max = isParamsObject ? params.max : params;

  const initialStep = React.useRef(initial);
  const maxStep = React.useRef(max);
  const [currentStep, setCurrentStep] = React.useState(initial);

  const isFirst = currentStep === FIRST_STEP_VALUE;
  const isLast = currentStep === maxStep.current;

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
    if (value === 'last') return setCurrentStep(maxStep.current);
    if (value >= maxStep.current) return setCurrentStep(maxStep.current);
    if (value <= FIRST_STEP_VALUE) return setCurrentStep(FIRST_STEP_VALUE);
    setCurrentStep(value);
  };

  return {
    counts: maxStep.current,
    currentStep,
    isFirst,
    isLast,
    next,
    back,
    reset,
    set
  };
};
