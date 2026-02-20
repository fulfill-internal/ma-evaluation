import { useState } from 'react';
import type { Answers } from '../types';
import { surveySections } from '../data/questions';
import ProgressBar from './ProgressBar';
import SurveySection from './SurveySection';
import styles from './Survey.module.css';

interface SurveyProps {
  currentSection: number;
  answers: Answers;
  onAnswer: (questionId: string, value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
  isFirstSection: boolean;
  isLastSection: boolean;
}

export default function Survey({
  currentSection,
  answers,
  onAnswer,
  onNext,
  onBack,
  onComplete,
  isFirstSection,
  isLastSection,
}: SurveyProps) {
  const [showValidation, setShowValidation] = useState(false);
  const section = surveySections[currentSection];

  const isSectionValid = () => {
    for (const question of section.questions) {
      if (!question.required) continue;
      const answer = answers[question.id];
      if (!answer || (Array.isArray(answer) && answer.length === 0)) {
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!isSectionValid()) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    if (isLastSection) {
      onComplete();
    } else {
      onNext();
    }
  };

  const handleBack = () => {
    setShowValidation(false);
    onBack();
  };

  return (
    <div className={styles.container}>
      <ProgressBar currentSection={currentSection} />
      <SurveySection section={section} answers={answers} onAnswer={onAnswer} />
      <div className={styles.nav}>
        {!isFirstSection ? (
          <button className={styles.backBtn} onClick={handleBack} type="button">
            Back
          </button>
        ) : (
          <div className={styles.spacer} />
        )}
        <button
          className={styles.nextBtn}
          onClick={handleNext}
          type="button"
        >
          {isLastSection ? 'See My Valuation' : 'Next'}
        </button>
      </div>
      <p className={styles.validationMsg}>
        {showValidation ? 'Please answer all questions before continuing.' : ''}
      </p>
    </div>
  );
}
