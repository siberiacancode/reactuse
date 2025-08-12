import { useRef, useState } from 'react';

/** The use step params type */
export interface UseStepParams {
  /** Initial value for step */
  initial: number;
  /** Maximum value for step */
  max: number;
}

/** The use step return type */
export interface UseStepReturn {
  /** Counts of steps */
  counts: number;
  /** Current value of step */
  currentStep: number;
  /** Boolean value if current step is first */
  isFirst: boolean;
  /** Boolean value if current step is last */
  isLast: boolean;
  /** Go to back step */
  back: () => void;
  /** Go to next step */
  next: () => void;
  /** Reset current step to initial value */
  reset: () => void;
  /** Go to custom step */
  set: (value: number | 'first' | 'last') => void;
}

const FIRST_STEP_VALUE = 1;

/**
 * @name useStep
 * @description - Hook that create stepper
 * @category State
 * @usage medium
 *
 * @overload
 * @param {number} max Maximum number of steps
 * @returns {UseStepReturn} An object contains variables and functions to change the step
 *
 * @example
 * const stepper = useStep(5);
 *
 * @overload
 * @param {number} params.max Maximum number of steps
 * @param {number} params.initial Initial value for step
 * @returns {UseStepReturn} An object contains variables and functions to change the step
 *
 * @example
 * const stepper = useStep({ initial: 2, max: 5 });
 */
export const useStep = (params: number | UseStepParams): UseStepReturn => {
  const max = typeof params === 'object' ? params.max : params;
  const initial = typeof params === 'object' ? params.initial : FIRST_STEP_VALUE;

  const initialStep = useRef(
    initial > max || initial < FIRST_STEP_VALUE ? FIRST_STEP_VALUE : initial
  );
  const [currentStep, setCurrentStep] = useState(initial);

  const isFirst = currentStep === FIRST_STEP_VALUE;
  const isLast = currentStep === max;

  const next = () => {
    if (isLast) return;
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const back = () => {
    if (isFirst) return;
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const reset = () => setCurrentStep(initialStep.current);

  const set = (value: number | 'first' | 'last') => {
    if (value === 'first') return setCurrentStep(initialStep.current);
    if (value === 'last') return setCurrentStep(max);
    if (value >= max) return setCurrentStep(max);
    if (value <= FIRST_STEP_VALUE) return setCurrentStep(FIRST_STEP_VALUE);
    setCurrentStep(value);
  };

  return {
    counts: max,
    currentStep,
    isFirst,
    isLast,
    next,
    back,
    reset,
    set
  };
};
