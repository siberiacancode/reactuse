import { useReducer } from 'react';
export const stateHistoryReducer = (state, action) => {
  switch (action.type) {
    case 'SET': {
      const { value, capacity } = action.payload;
      const newHistory = [...state.history.slice(0, state.currentIndex + 1), value];
      if (newHistory.length > capacity) {
        newHistory.shift();
      }
      const newUndoStack = [state.history, ...state.undoStack];
      if (newUndoStack.length > capacity) {
        newUndoStack.pop();
      }
      return {
        history: newHistory,
        currentIndex: newHistory.length - 1,
        undoStack: newUndoStack,
        redoStack: []
      };
    }
    case 'UNDO': {
      if (state.undoStack.length === 0) return state;
      return {
        history: state.undoStack[0],
        currentIndex: state.undoStack[0].length - 1,
        undoStack: state.undoStack.slice(1),
        redoStack: [state.history, ...state.redoStack]
      };
    }
    case 'REDO': {
      if (state.redoStack.length === 0) return state;
      return {
        history: state.redoStack[0],
        currentIndex: state.redoStack[0].length - 1,
        undoStack: [state.history, ...state.undoStack],
        redoStack: state.redoStack.slice(1)
      };
    }
    case 'BACK': {
      const { steps } = action.payload;
      return {
        ...state,
        currentIndex: Math.max(0, state.currentIndex - steps)
      };
    }
    case 'FORWARD': {
      const { steps } = action.payload;
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + steps, state.history.length - 1)
      };
    }
    case 'RESET': {
      const { initialValue, capacity } = action.payload;
      if (state.history.length === 1) return state;
      const newUndoStack = [state.history, ...state.undoStack];
      if (newUndoStack.length > capacity) {
        newUndoStack.pop();
      }
      return {
        history: [initialValue],
        currentIndex: 0,
        undoStack: newUndoStack,
        redoStack: []
      };
    }
    default:
      throw new Error('Unsupported action type');
  }
};
/**
 * @name useStateHistory
 * @description - Hook that manages state with history functionality
 * @category State
 * @usage medium
 *
 * @param {Value} initialValue - The initial value to start the history with
 * @param {number} [capacity=10] - Maximum number of history entries and undo actions to keep
 * @returns {UseStateHistoryReturn<Value>} Object containing current value, history array and control methods
 *
 * @example
 * const { value, history, index, set, back, forward, reset, undo, redo, canUndo, canRedo } = useStateHistory(0);
 */
export const useStateHistory = (initialValue, capacity = 10) => {
  const [state, dispatch] = useReducer(stateHistoryReducer, {
    history: [initialValue],
    currentIndex: 0,
    undoStack: [],
    redoStack: []
  });
  const value = state.history[state.currentIndex];
  const canUndo = state.undoStack.length > 0;
  const canRedo = state.redoStack.length > 0;
  const set = (value) =>
    dispatch({
      type: 'SET',
      payload: { value, capacity }
    });
  const undo = () => dispatch({ type: 'UNDO' });
  const redo = () => dispatch({ type: 'REDO' });
  const back = (steps = 1) => dispatch({ type: 'BACK', payload: { steps } });
  const forward = (steps = 1) => dispatch({ type: 'FORWARD', payload: { steps } });
  const reset = () => dispatch({ type: 'RESET', payload: { initialValue, capacity } });
  return {
    history: state.history,
    value,
    set,
    index: state.currentIndex,
    back,
    forward,
    reset,
    undo,
    redo,
    canUndo,
    canRedo
  };
};
