/** Revenue range → midpoint (in dollars) and base multiple range */
export const revenueMultiples: Record<string, { midpoint: number; multipleLow: number; multipleHigh: number }> = {
  under_1m:   { midpoint: 500_000,     multipleLow: 3.0, multipleHigh: 4.0 },
  '1m_3m':    { midpoint: 2_000_000,   multipleLow: 3.5, multipleHigh: 4.5 },
  '3m_7m':    { midpoint: 5_000_000,   multipleLow: 4.0, multipleHigh: 5.5 },
  '7m_10m':   { midpoint: 8_500_000,   multipleLow: 4.5, multipleHigh: 6.0 },
  '10m_15m':  { midpoint: 12_500_000,  multipleLow: 5.0, multipleHigh: 6.5 },
  '15m_20m':  { midpoint: 17_500_000,  multipleLow: 5.5, multipleHigh: 7.0 },
  '20m_30m':  { midpoint: 25_000_000,  multipleLow: 6.0, multipleHigh: 7.5 },
  '30m_50m':  { midpoint: 40_000_000,  multipleLow: 6.5, multipleHigh: 8.0 },
  '50m_75m':  { midpoint: 62_500_000,  multipleLow: 7.0, multipleHigh: 8.5 },
  '75m_100m': { midpoint: 87_500_000,  multipleLow: 7.5, multipleHigh: 9.0 },
  '100m_plus':{ midpoint: 150_000_000, multipleLow: 8.0, multipleHigh: 10.0 },
};

/** Parse EBITDA margin slider value (e.g. "15") → decimal (e.g. 0.15) */
export function getEbitdaMarginRate(value: string): number {
  const parsed = parseFloat(value);
  if (isNaN(parsed)) {
    throw new Error(`Invalid EBITDA margin value: ${value}`);
  }
  return parsed / 100;
}

/** Revenue growth adjuster */
export const revenueGrowthAdjustments: Record<string, { low: number; high: number }> = {
  growing_fast:     { low: 0.5, high: 1.0 },
  growing_moderate: { low: 0.25, high: 0.5 },
  flat:             { low: 0, high: 0 },
  declining:        { low: -1.5, high: -0.5 },
};

/** Client concentration adjuster */
export const clientConcentrationAdjustments: Record<string, { low: number; high: number }> = {
  under_10: { low: 0.5, high: 0.5 },
  '10_25':  { low: 0, high: 0 },
  '25_40':  { low: -0.5, high: -0.5 },
  '40_60':  { low: -1.0, high: -1.0 },
  over_60:  { low: -2.0, high: -2.0 },
};

/** Contract revenue adjuster */
export const contractRevenueAdjustments: Record<string, { low: number; high: number }> = {
  mostly_contracted:   { low: 0.5, high: 0.5 },
  majority_contracted: { low: 0.25, high: 0.25 },
  mix:                 { low: 0, high: 0 },
  transactional:       { low: -0.25, high: -0.25 },
};

/** Management independence adjuster */
export const mgmtIndependenceAdjustments: Record<string, { low: number; high: number }> = {
  hands_off:         { low: 0.5, high: 1.0 },
  mostly_delegated:  { low: 0.25, high: 0.5 },
  moderate:          { low: 0, high: 0 },
  heavily_involved:  { low: -1.0, high: -0.5 },
};

/** Lease terms adjuster */
export const leaseTermsAdjustments: Record<string, { low: number; high: number }> = {
  own:         { low: 0.25, high: 0.25 },
  long_lease:  { low: 0.25, high: 0.25 },
  mid_lease:   { low: 0, high: 0 },
  short_lease: { low: -0.25, high: -0.25 },
};

/** Adjuster factor configs with weights and labels */
export const adjusterFactors = [
  {
    id: 'revenue_trend',
    name: 'Revenue Growth',
    weight: 0.08,
    adjustments: revenueGrowthAdjustments,
    premiumLabel: 'Strong revenue growth adds buyer confidence',
    neutralLabel: 'Flat revenue is typical for stable 3PLs',
    discountLabel: 'Declining revenue reduces buyer interest',
  },
  {
    id: 'top_client_concentration',
    name: 'Client Concentration',
    weight: 0.08,
    adjustments: clientConcentrationAdjustments,
    premiumLabel: 'Well-diversified client base reduces risk',
    neutralLabel: 'Moderate client concentration',
    discountLabel: 'High client concentration is a significant risk',
  },
  {
    id: 'recurring_revenue_pct',
    name: 'Contract Revenue',
    weight: 0.06,
    adjustments: contractRevenueAdjustments,
    premiumLabel: 'High contracted revenue signals predictability',
    neutralLabel: 'Mixed revenue model',
    discountLabel: 'Mostly transactional revenue adds uncertainty',
  },
  {
    id: 'mgmt_independence',
    name: 'Management Independence',
    weight: 0.05,
    adjustments: mgmtIndependenceAdjustments,
    premiumLabel: 'Business runs without the owner — big plus for buyers',
    neutralLabel: 'Owner is moderately involved',
    discountLabel: 'Owner-dependent operations concern buyers',
  },
  {
    id: 'lease_terms',
    name: 'Lease Terms',
    weight: 0.03,
    adjustments: leaseTermsAdjustments,
    premiumLabel: 'Strong lease position or property ownership',
    neutralLabel: 'Standard lease terms',
    discountLabel: 'Short lease creates transition risk',
  },
] as const;
