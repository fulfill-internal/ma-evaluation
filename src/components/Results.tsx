import type { ValuationResult } from '../types';
import { formatCurrency } from '../engine/valuationEngine';
import styles from './Results.module.css';

interface ResultsProps {
  result: ValuationResult;
  hasConcentrationRisk: boolean;
}

export default function Results({ result, hasConcentrationRisk }: ResultsProps) {
  const { valuationLow, valuationHigh, ebitdaMultipleLow, ebitdaMultipleHigh, estimatedEbitda, factors } = result;

  const impactIcon = (impact: string) => {
    if (impact === 'premium') return '+';
    if (impact === 'discount') return '-';
    return '~';
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.headerBadge}>Valuation Complete</span>
          <h1 className={styles.headerTitle}>Your Estimated Valuation</h1>
          <p className={styles.headerSubtitle}>
            Based on your responses, here is your estimated market value range.
          </p>
        </div>

        <div className={styles.valuationCard}>
          <p className={styles.valuationLabel}>Estimated Enterprise Value</p>
          <p className={styles.valuationRange}>
            {formatCurrency(valuationLow)} – {formatCurrency(valuationHigh)}
          </p>
          <p className={styles.multipleRange}>
            {ebitdaMultipleLow.toFixed(1)}x – {ebitdaMultipleHigh.toFixed(1)}x EBITDA Multiple
          </p>
          <p className={styles.ebitdaNote}>
            Based on estimated EBITDA of {formatCurrency(estimatedEbitda)}
          </p>
        </div>

        {hasConcentrationRisk && (
          <div className={styles.concentrationWarning}>
            <span className={styles.warningIcon}>&#9888;</span>
            <p className={styles.warningText}>
              <strong>Client Concentration Risk Detected:</strong> More than 25% of your revenue
              comes from a single client. This is one of the top concerns for buyers and can
              significantly impact valuation multiples. Diversifying your client base before a
              transaction could substantially increase your company's value.
            </p>
          </div>
        )}

        {factors.length > 0 && (
          <div className={styles.factorsCard}>
            <h2 className={styles.factorsTitle}>Key Valuation Factors</h2>
            {factors.map((factor) => (
              <div key={factor.name} className={styles.factor}>
                <div className={`${styles.factorIcon} ${styles[factor.impact]}`}>
                  {impactIcon(factor.impact)}
                </div>
                <div className={styles.factorContent}>
                  <p className={styles.factorName}>{factor.name}</p>
                  <p className={styles.factorDesc}>{factor.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Want to Explore Your Options?</h2>
          <p className={styles.ctaText}>
            Our M&A advisory team specializes in 3PL transactions. We'll review your valuation
            in detail and discuss your options — confidentially.
          </p>
          <a
            className={styles.ctaButton}
            href={import.meta.env.VITE_CALENDAR_URL || 'https://fulfill.com/contact'}
            target="_blank"
            rel="noopener noreferrer"
          >
            Schedule a Confidential Call
          </a>
        </div>

        <p className={styles.disclaimer}>
          This valuation is an estimate based on industry benchmarks and your self-reported data.
          It is not a formal appraisal or guarantee of value. Actual transaction values depend on
          due diligence, market conditions, and buyer-specific factors.
        </p>
      </div>
    </div>
  );
}
