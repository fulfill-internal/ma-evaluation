import { surveySections } from '../data/questions';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  currentSection: number;
}

export default function ProgressBar({ currentSection }: ProgressBarProps) {
  const total = surveySections.length;
  const fillPercent = total > 1 ? (currentSection / (total - 1)) * 100 : 0;

  return (
    <div className={styles.container}>
      <div className={styles.steps}>
        <div className={styles.line}>
          <div className={styles.lineFill} style={{ width: `${fillPercent}%` }} />
        </div>
        {surveySections.map((section, i) => {
          const isActive = i === currentSection;
          const isCompleted = i < currentSection;
          return (
            <div key={section.id} className={styles.step}>
              <div
                className={`${styles.dot} ${isActive ? styles.dotActive : ''} ${isCompleted ? styles.dotCompleted : ''}`}
              >
                {isCompleted ? '✓' : i + 1}
              </div>
              <span className={`${styles.label} ${isActive ? styles.labelActive : ''}`}>
                {section.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
