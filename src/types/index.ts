export type QuestionType = 'text' | 'select' | 'multi-select' | 'dropdown-multi' | 'radio' | 'range';

export interface QuestionOption {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  tooltip?: string;
  required: boolean;
  placeholder?: string;
}

export interface SurveySection {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export type Answers = Record<string, string | string[]>;

export interface ValuationResult {
  valuationLow: number;
  valuationHigh: number;
  ebitdaMultipleLow: number;
  ebitdaMultipleHigh: number;
  estimatedEbitda: number;
  factors: ValuationFactor[];
}

export interface ValuationFactor {
  name: string;
  impact: 'premium' | 'neutral' | 'discount';
  description: string;
  adjustmentLow: number;
  adjustmentHigh: number;
}

export type AppScreen = 'landing' | 'survey' | 'calculating' | 'results';

export interface Evaluation {
  id: string;
  email: string;
  status: 'started' | 'completed';
  current_section: number;
  answers: Answers;
  valuation_low: number | null;
  valuation_high: number | null;
  ebitda_multiple_low: number | null;
  ebitda_multiple_high: number | null;
  abandoned_email_count: number;
  last_abandoned_email_at: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface SurveyState {
  currentSection: number;
  answers: Answers;
  email: string;
  evaluationId: string | null;
}

export type SurveyAction =
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SET_EVALUATION_ID'; id: string }
  | { type: 'SET_ANSWER'; questionId: string; value: string | string[] }
  | { type: 'NEXT_SECTION' }
  | { type: 'PREV_SECTION' }
  | { type: 'RESTORE_STATE'; state: Partial<SurveyState> };
