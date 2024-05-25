import { useState, useRef } from 'react';

interface UseStepProps {
  /** Initial value for step */
  initial?: number;
  /** Maximum value for step */
  max: number;
}

interface UseStepReturn {
  /** Current value of step */
  currentStep: number;
  /** Current value of step is initial one */
  isFirstStep: boolean;
  /** Current value of step is last one */
  isLastStep: boolean;
  /** Go to next step */
  nextStep: () => void;
  /** Go to previous step */
  prevStep: () => void;
  /** Reset current step to initial value */
  resetStep: () => void;
  /** Go to custom step */
  setStep: (value: number) => void;
}

export function useStep({ initial = 0, max }: UseStepProps): UseStepReturn {
  const initialStep = useRef(initial);
  const maxStep = useRef(max);
  const [currentStep, setCurrentStep] = useState(initial);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === maxStep.current;

  const nextStep = () => {
    if (isLastStep) {
      return;
    }

    setCurrentStep((step) => step + 1);
  };

  const prevStep = () => {
    if (isFirstStep) {
      return;
    }

    setCurrentStep((step) => step - 1);
  };

  const resetStep = () => {
    setCurrentStep(initialStep.value);
  };

  const setStep = (value: number) => {
    if (value > maxStep.current || value < initialStep.value) {
      return;
    }

    setCurrentStep(value);
  };

  return {
    currentStep,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    resetStep,
    setStep,
  };
}
