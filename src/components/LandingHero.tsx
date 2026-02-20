import { useState, FormEvent } from 'react';
import styles from './LandingHero.module.css';

interface LandingHeroProps {
  onSubmit: (email: string) => Promise<void>;
}

export default function LandingHero({ onSubmit }: LandingHeroProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(trimmed);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.hero}>
      <div className={styles.card}>
        <span className={styles.badge}>Confidential & Free</span>
        <h1 className={styles.headline}>What's Your 3PL Really Worth?</h1>
        <p className={styles.subheadline}>
          Get a data-driven valuation estimate for your third-party logistics business in under 5
          minutes. Powered by real M&A transaction data.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            className={styles.emailInput}
            placeholder="Enter your work email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            autoComplete="email"
          />
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Starting...' : 'Begin Evaluation'}
          </button>
          <p className={styles.errorMsg}>{error}</p>
        </form>

        <div className={styles.trust}>
          <div className={styles.trustItem}>
            <span className={styles.trustNumber}>18+</span>
            <span className={styles.trustLabel}>Closed Transactions</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustNumber}>$1B+</span>
            <span className={styles.trustLabel}>Transaction Value Advised</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustNumber}>100%</span>
            <span className={styles.trustLabel}>Confidential</span>
          </div>
        </div>

        <p className={styles.privacy}>
          Your information is kept strictly confidential and will never be shared.
        </p>
      </div>
    </div>
  );
}
