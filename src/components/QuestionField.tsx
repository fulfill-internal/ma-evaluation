import type { Question } from '../types';
import Tooltip from './Tooltip';
import styles from './QuestionField.module.css';

interface QuestionFieldProps {
  question: Question;
  value: string | string[] | undefined;
  onChange: (questionId: string, value: string | string[]) => void;
}

export default function QuestionField({ question, value, onChange }: QuestionFieldProps) {
  const { id, text, type, options, tooltip, placeholder } = question;

  const handleRadioChange = (optionValue: string) => {
    onChange(id, optionValue);
  };

  const handleCheckboxChange = (optionValue: string) => {
    const current = Array.isArray(value) ? value : [];
    const updated = current.includes(optionValue)
      ? current.filter((v) => v !== optionValue)
      : [...current, optionValue];
    onChange(id, updated);
  };

  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {text}
        {tooltip && <Tooltip text={tooltip} />}
      </label>

      {type === 'text' && (
        <input
          type="text"
          className={styles.textInput}
          value={(value as string) || ''}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder={placeholder}
        />
      )}

      {type === 'select' && (
        <select
          className={styles.selectInput}
          value={(value as string) || ''}
          onChange={(e) => onChange(id, e.target.value)}
        >
          <option value="">Select an option...</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {type === 'radio' && (
        <div className={styles.radioGroup}>
          {options?.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <label
                key={opt.value}
                className={`${styles.radioOption} ${isSelected ? styles.radioOptionSelected : ''}`}
              >
                <input
                  type="radio"
                  className={styles.radioInput}
                  name={id}
                  value={opt.value}
                  checked={isSelected}
                  onChange={() => handleRadioChange(opt.value)}
                />
                <span className={styles.radioLabel}>{opt.label}</span>
              </label>
            );
          })}
        </div>
      )}

      {type === 'multi-select' && (
        <div className={styles.checkboxGroup}>
          {options?.map((opt) => {
            const currentValues = Array.isArray(value) ? value : [];
            const isChecked = currentValues.includes(opt.value);
            return (
              <label
                key={opt.value}
                className={`${styles.checkboxOption} ${isChecked ? styles.checkboxOptionSelected : ''}`}
              >
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={isChecked}
                  onChange={() => handleCheckboxChange(opt.value)}
                />
                <span className={styles.checkboxLabel}>{opt.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
