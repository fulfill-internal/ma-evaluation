import { useState, useRef, type FormEvent } from 'react';
import styles from './LandingHero.module.css';

interface LandingHeroProps {
  onSubmit: (email: string) => Promise<void>;
}

const STATS = [
  { value: '$1B+', label: 'Transaction Volume Advised' },
  { value: '18', label: 'Closed Transactions' },
  { value: '85%', label: 'LOIs Proceed to Close' },
  { value: '5,000+', label: 'Proprietary 3PL Database' },
  { value: '50+', label: 'Active Mandates' },
];

const VALUE_CARDS = [
  {
    icon: 'https://cdn.prod.website-files.com/621c94d9cedd7b30384e60aa/686d55b2c468605f89c7a21c_layer.svg',
    title: 'Unmatched Deal Flow',
    desc: 'Proprietary database of 5,000+ pre-qualified 3PLs with in-depth profiles and performance benchmarks.',
  },
  {
    icon: 'https://cdn.prod.website-files.com/621c94d9cedd7b30384e60aa/686d55c79b6ef5b56fee2323_status-up.svg',
    title: 'Valuation Precision',
    desc: 'Industry veterans leveraging proprietary market data to pinpoint the levers driving acquisition prices and validating Enterprise Value.',
  },
  {
    icon: 'https://cdn.prod.website-files.com/621c94d9cedd7b30384e60aa/686d55ef50eb829477847ecf_setting-3.svg',
    title: 'True Operator Insight',
    desc: "We apply founder experience to every deal. Our team has built, scaled, and exited 3PLs — we've been exactly where you are.",
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Get Valued',
    desc: 'Complete the assessment. Receive your instant valuation range and Exit Readiness Score.',
  },
  {
    num: '02',
    title: 'Strategy Call',
    desc: 'Review results with M&A experts — former 3PL founders, $0 to $15M exits. Free, no pressure.',
  },
  {
    num: '03',
    title: 'Go to Market',
    desc: 'Confidential outreach to 50–100 pre-qualified buyers. We manage the full process.',
  },
  {
    num: '04',
    title: 'Close',
    desc: '85% of our initiated LOIs proceed to close. We support every step through to completion.',
  },
];

export default function LandingHero({ onSubmit }: LandingHeroProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

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

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    formRef.current?.querySelector('input')?.focus();
  };

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.badge}>Free Instant 3PL Valuation</span>
          <h1 className={styles.headline}>
            What Is Your <span className={styles.headlineAccent}>3PL Worth Today?</span>
          </h1>
          <p className={styles.heroSub}>
            Partner with the industry's leading 3PL M&amp;A specialists. Answer a few questions and
            get an instant, data-driven valuation — built on real transaction multiples from our
            proprietary database of 5,000+ 3PLs.
          </p>

          <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
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
              {loading ? 'Starting...' : 'Get My Free Valuation*'}
            </button>
          </form>
          <p className={styles.errorMsg}>{error}</p>
          <p className={styles.termsDisclaimer}>
            *By clicking "Get My Free Valuation" you agree to our{' '}
            <a href="https://www.fulfill.com/terms-and-conditions" target="_blank" rel="noopener noreferrer">
              Terms and Conditions
            </a>
          </p>
          <p className={styles.heroMeta}>~4 minutes · 100% confidential · No obligation</p>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className={styles.statsBar}>
        <div className={styles.statsInner}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statNumber}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Value Propositions ── */}
      <section className={styles.valueProps}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>
            Institutional-Grade Execution, Purpose-Built for Logistics
          </h2>
          <p className={styles.sectionSub}>
            Unlike traditional investment banks, we speak the language of logistics — evaluating
            every deal through both financial and operational lenses.
          </p>
          <div className={styles.cardsGrid}>
            {VALUE_CARDS.map((c) => (
              <div key={c.title} className={styles.card}>
                <div className={styles.cardIcon}><img src={c.icon} alt="" width={28} height={28} /></div>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <p className={styles.cardDesc}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className={styles.testimonial}>
        <div className={styles.testimonialCard}>
          <img
            src="https://cdn.prod.website-files.com/621c94d9cedd7b30384e60aa/688996e1f92559fe8e4f2417_Diego.jpeg"
            alt="Diego Sampaio"
            className={styles.testimonialPhoto}
          />
          <div className={styles.testimonialContent}>
            <div className={styles.quoteIcon}>
              <img src="https://cdn.prod.website-files.com/621c94d9cedd7b30384e60aa/686d5d324f0ea737a1c4036a_quote-down.svg" alt="" width={40} height={40} />
            </div>
            <p className={styles.quoteText}>
              Fulfill was critical in facilitating our successful exit. Their deep industry knowledge
              and extensive network helped us identify the perfect buyer when we were prepared to sell.
              The transaction closed above our initial expectations, and the process exceeded all
              our requirements for a smooth and expedient transition.
            </p>
            <div className={styles.quoteAttribution}>
              <p className={styles.quoteAuthor}>Diego Sampaio</p>
              <p className={styles.quoteRole}>CEO, USA Ecommerce Fulfillment</p>
            </div>
          </div>
          <div className={styles.transactionDetails}>
            <h4 className={styles.transactionTitle}>Transaction Details</h4>
            <div className={styles.transactionGrid}>
              <div className={styles.transactionItem}>
                <span className={styles.transactionLabel}>TRANSACTION TYPE</span>
                <span className={styles.transactionValue}>Sell Side</span>
              </div>
              <div className={styles.transactionItem}>
                <span className={styles.transactionLabel}>TIMELINE</span>
                <span className={styles.transactionValue}>5 months</span>
              </div>
              <div className={styles.transactionItem}>
                <span className={styles.transactionLabel}>DEAL STRUCTURE</span>
                <span className={styles.transactionValue}>Full Exit</span>
              </div>
              <div className={styles.transactionItem}>
                <span className={styles.transactionLabel}>KEY HIGHLIGHTS</span>
                <span className={styles.transactionValue}>
                  - International client base<br />
                  - 8 year operating history
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className={styles.howItWorks}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Your Perfect Exit in 4 Steps</h2>
          <div className={styles.stepsGrid}>
            {STEPS.map((s) => (
              <div key={s.num} className={styles.stepCard}>
                <div className={styles.stepNumber}>{s.num}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Find Out What Your 3PL Is Worth</h2>
        <button type="button" className={styles.ctaBtn} onClick={scrollToForm}>
          Get My Free Valuation*
        </button>
        <p className={styles.ctaSub}>
          Sellers on Fulfill.com average 34% above their initial valuation estimate
        </p>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        © 2025 Fulfill.com · All submissions strictly confidential · fulfill.com/m-a
      </footer>
    </div>
  );
}
