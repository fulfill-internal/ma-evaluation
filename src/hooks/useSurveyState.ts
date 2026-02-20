import { useReducer, useCallback } from 'react';
import type { SurveyState, SurveyAction, Answers } from '../types';
import { surveySections } from '../data/questions';

const initialState: SurveyState = {
  currentSection: 0,
  answers: {},
  email: '',
  evaluationId: null,
};

function surveyReducer(state: SurveyState, action: SurveyAction): SurveyState {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.email };
    case 'SET_EVALUATION_ID':
      return { ...state, evaluationId: action.id };
    case 'SET_ANSWER':
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.value },
      };
    case 'NEXT_SECTION':
      return {
        ...state,
        currentSection: Math.min(state.currentSection + 1, surveySections.length - 1),
      };
    case 'PREV_SECTION':
      return {
        ...state,
        currentSection: Math.max(state.currentSection - 1, 0),
      };
    case 'RESTORE_STATE':
      return {
        ...state,
        ...action.state,
      };
    default:
      return state;
  }
}

export function useSurveyState() {
  const [state, dispatch] = useReducer(surveyReducer, initialState);

  const setEmail = useCallback((email: string) => {
    dispatch({ type: 'SET_EMAIL', email });
  }, []);

  const setEvaluationId = useCallback((id: string) => {
    dispatch({ type: 'SET_EVALUATION_ID', id });
  }, []);

  const setAnswer = useCallback((questionId: string, value: string | string[]) => {
    dispatch({ type: 'SET_ANSWER', questionId, value });
  }, []);

  const nextSection = useCallback(() => {
    dispatch({ type: 'NEXT_SECTION' });
  }, []);

  const prevSection = useCallback(() => {
    dispatch({ type: 'PREV_SECTION' });
  }, []);

  const restoreState = useCallback((partial: Partial<SurveyState>) => {
    dispatch({ type: 'RESTORE_STATE', state: partial });
  }, []);

  const validateCurrentSection = useCallback((): boolean => {
    const section = surveySections[state.currentSection];
    for (const question of section.questions) {
      if (!question.required) continue;
      const answer = state.answers[question.id];
      if (!answer || (Array.isArray(answer) && answer.length === 0)) {
        return false;
      }
    }
    return true;
  }, [state.currentSection, state.answers]);

  const isLastSection = state.currentSection === surveySections.length - 1;
  const isFirstSection = state.currentSection === 0;

  return {
    state,
    setEmail,
    setEvaluationId,
    setAnswer,
    nextSection,
    prevSection,
    restoreState,
    validateCurrentSection,
    isLastSection,
    isFirstSection,
    currentSectionData: surveySections[state.currentSection],
    totalSections: surveySections.length,
    answers: state.answers as Answers,
  };
}
