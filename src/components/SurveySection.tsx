import type { SurveySection as SurveySectionType, Answers } from '../types';
import QuestionField from './QuestionField';
import styles from './SurveySection.module.css';

interface SurveySectionProps {
  section: SurveySectionType;
  answers: Answers;
  onAnswer: (questionId: string, value: string | string[]) => void;
}

export default function SurveySection({ section, answers, onAnswer }: SurveySectionProps) {
  return (
    <div className={styles.section} key={section.id}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{section.title}</h2>
        <p className={styles.sectionDescription}>{section.description}</p>
      </div>
      {section.questions.map((question) => (
        <QuestionField
          key={question.id}
          question={question}
          value={answers[question.id]}
          onChange={onAnswer}
        />
      ))}
    </div>
  );
}
