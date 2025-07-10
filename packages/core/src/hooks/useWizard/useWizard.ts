import { useState } from 'react';

export interface WizardItem<WizardStepId> {
  id: WizardStepId;
  nodes?: WizardStepId[];
}

/**
 * @name useWizard
 * @description - Hook that manages a wizard
 * @category Utilities
 *
 * @param {WizardItem<WizardStepId>[]} map The map of the wizard
 * @param {WizardStepId} [initialStepId] The initial step id
 * @returns {UseWizardReturn<WizardStepId>} An object containing the current step id and functions to interact with the wizard
 *
 * @example
 * const { currentStepId, set, reset, back, next, history } = useWizard([
 *  { id: 'step1', nodes: ['step2', 'step3'] },
 *  { id: 'step2', nodes: ['step3'] },
 *  { id: 'step3', nodes: [] },
 * ])
 */
export const useWizard = <WizardStepId extends string>(
  map: WizardItem<WizardStepId>[],
  initialStepId?: WizardStepId
) => {
  const initialId = initialStepId ?? map[0].id;
  const wizardMap = new Map(map.map((wizardItem) => [wizardItem.id, wizardItem]));
  const [currentStepId, setCurrentStepId] = useState(initialId);
  const [history, setHistory] = useState<WizardStepId[]>([initialId]);

  const set = (id: WizardStepId) => {
    if (!wizardMap.get(currentStepId)?.nodes?.includes(id))
      throw new Error(`Can't go to ${id} from ${currentStepId}`);

    setHistory([...history, id]);
    setCurrentStepId(id);
  };

  const back = () => {
    if (history.length === 1) return;

    const previousStepId = history[history.length - 2];
    if (!wizardMap.get(currentStepId)?.nodes?.includes(previousStepId))
      throw new Error(`Can't go to ${previousStepId} from ${currentStepId}`);

    setHistory(history.slice(0, -1));
    setCurrentStepId(history[history.length - 2]);
  };

  const reset = () => {
    setCurrentStepId(initialId);
    setHistory([initialId]);
  };

  return { currentStepId, set, reset, back, history };
};
