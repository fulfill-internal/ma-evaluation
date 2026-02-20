/** Revenue range → midpoint (in dollars) and base multiple range */
export const revenueMultiples: Record<string, { midpoint: number; multipleLow: number; multipleHigh: number }> = {
  under_1m:  { midpoint: 500_000,    multipleLow: 3.0, multipleHigh: 4.0 },
  '1m_3m':   { midpoint: 2_000_000,  multipleLow: 3.5, multipleHigh: 4.5 },
  '3m_7m':   { midpoint: 5_000_000,  multipleLow: 4.0, multipleHigh: 5.5 },
  '7m_15m':  { midpoint: 11_000_000, multipleLow: 4.5, multipleHigh: 6.0 },
  '15m_30m': { midpoint: 22_500_000, multipleLow: 5.0, multipleHigh: 6.5 },
  '30m_plus':{ midpoint: 45_000_000, multipleLow: 5.5, multipleHigh: 7.0 },
};

/** EBITDA margin range → midpoint percentage (as decimal) */
export const ebitdaMargins: Record<string, number> = {
  under_5: 0.03,
  '5_10':  0.075,
  '10_15': 0.125,
  '15_20': 0.175,
  '20_plus': 0.225,
};

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
