import { useCallback, useMemo, useReducer } from 'react';
function stateHistoryReducer(state, action) {
  switch (action.type) {
    case 'SET': {
      const { value, historyCapacity, undoCapacity } = action.payload;
      const newHistory = [...state.history.slice(0, state.currentIndex + 1), value];
      if (historyCapacity && newHistory.length > historyCapacity) {
        newHistory.shift();
      }
      const newUndoStack = [state.history, ...state.undoStack];
      if (undoCapacity && newUndoStack.length > undoCapacity) {
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
      const { initialValue, undoCapacity } = action.payload;
      if (state.history.length === 1) return state;
      const newUndoStack = [state.history, ...state.undoStack];
      if (undoCapacity && newUndoStack.length > undoCapacity) {
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
}
/**
 * @name useStateHistory
 * @description - Hook that manages state with history functionality
 * @category Utilities
 *
 * @param {Value} initialValue - The initial value to start the history with
 * @param {number} [historyCapacity=10] - Maximum number of history entries to keep
 * @param {number} [undoCapacity=10] - Maximum number of undo actions to keep
 * @returns {UseStateHistoryReturn<Value>} Object containing current value, history array and control methods
 *
 * @example
 * const { value, history, index, set, back, forward, reset, undo, redo, canUndo, canRedo, } = useStateHistory(0);
 */
export const useStateHistory = (initialValue, historyCapacity, undoCapacity) => {
  const [state, dispatch] = useReducer(stateHistoryReducer, {
    history: [initialValue],
    currentIndex: 0,
    undoStack: [],
    redoStack: []
  });
  const currentValue = useMemo(
    () => state.history[state.currentIndex],
    [state.history, state.currentIndex]
  );
  const canUndo = useMemo(() => state.undoStack.length > 0, [state.undoStack]);
  const canRedo = useMemo(() => state.redoStack.length > 0, [state.redoStack]);
  const set = useCallback(
    (value) => {
      dispatch({
        type: 'SET',
        payload: { value, historyCapacity, undoCapacity }
      });
    },
    [historyCapacity, undoCapacity]
  );
  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, [canUndo]);
  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, [canRedo]);
  const back = useCallback((steps = 1) => {
    dispatch({ type: 'BACK', payload: { steps } });
  }, []);
  const forward = useCallback((steps = 1) => {
    dispatch({ type: 'FORWARD', payload: { steps } });
  }, []);
  const reset = useCallback(() => {
    dispatch({
      type: 'RESET',
      payload: { initialValue, undoCapacity }
    });
  }, [initialValue, undoCapacity]);
  return {
    history: state.history,
    value: currentValue,
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
