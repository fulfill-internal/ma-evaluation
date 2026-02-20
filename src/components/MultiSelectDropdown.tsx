import { useState, useRef, useEffect } from 'react';
import type { QuestionOption } from '../types';
import styles from './MultiSelectDropdown.module.css';

interface MultiSelectDropdownProps {
  options: QuestionOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export default function MultiSelectDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select options...',
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      searchRef.current?.focus();
    }
  }, [open]);

  const toggle = (optionValue: string) => {
    const updated = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(updated);
  };

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const displayText =
    value.length === 0
      ? placeholder
      : `${value.length} selected`;

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span className={value.length === 0 ? styles.triggerPlaceholder : undefined}>
          {displayText}
        </span>
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.searchWrap}>
            <input
              ref={searchRef}
              type="text"
              className={styles.searchInput}
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.optionsList}>
            {filtered.length === 0 ? (
              <div className={styles.noResults}>No matches</div>
            ) : (
              filtered.map((opt) => (
                <label key={opt.value} className={styles.option}>
                  <input
                    type="checkbox"
                    className={styles.optionCheckbox}
                    checked={value.includes(opt.value)}
                    onChange={() => toggle(opt.value)}
                  />
                  <span className={styles.optionLabel}>{opt.label}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
