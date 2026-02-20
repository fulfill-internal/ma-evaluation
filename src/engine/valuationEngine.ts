import type { Answers, ValuationResult, ValuationFactor } from '../types';
import {
  revenueMultiples,
  ebitdaMargins,
  adjusterFactors,
} from './scoringRules';

export function calculateValuation(answers: Answers): ValuationResult {
  const revenueRange = answers.revenue_range as string;
  const ebitdaMargin = answers.ebitda_margin as string;

  // Tier 1: Baseline EBITDA and multiple
  const revenue = revenueMultiples[revenueRange];
  const marginRate = ebitdaMargins[ebitdaMargin];

  if (!revenue || marginRate === undefined) {
    throw new Error('Missing required financial answers for valuation calculation');
  }

  const estimatedEbitda = revenue.midpoint * marginRate;
  let baseMultipleLow = revenue.multipleLow;
  let baseMultipleHigh = revenue.multipleHigh;

  // Tier 2: Apply adjusters
  const factors: ValuationFactor[] = [];
  let totalAdjustmentLow = 0;
  let totalAdjustmentHigh = 0;

  for (const factor of adjusterFactors) {
    const answerValue = answers[factor.id] as string;
    if (!answerValue) continue;

    const adjustment = factor.adjustments[answerValue];
    if (!adjustment) continue;

    const adjLow = adjustment.low;
    const adjHigh = adjustment.high;

    totalAdjustmentLow += adjLow;
    totalAdjustmentHigh += adjHigh;

    let impact: ValuationFactor['impact'];
    let description: string;

    if (adjLow > 0 || adjHigh > 0) {
      impact = 'premium';
      description = factor.premiumLabel;
    } else if (adjLow < 0 || adjHigh < 0) {
      impact = 'discount';
      description = factor.discountLabel;
    } else {
      impact = 'neutral';
      description = factor.neutralLabel;
    }

    factors.push({
      name: factor.name,
      impact,
      description,
      adjustmentLow: adjLow,
      adjustmentHigh: adjHigh,
    });
  }

  // Final multiples = base + adjustments (floor at 2.0x)
  const finalMultipleLow = Math.max(2.0, baseMultipleLow + totalAdjustmentLow);
  const finalMultipleHigh = Math.max(2.0, baseMultipleHigh + totalAdjustmentHigh);

  // Final valuation = EBITDA × multiple
  const valuationLow = estimatedEbitda * finalMultipleLow;
  const valuationHigh = estimatedEbitda * finalMultipleHigh;

  return {
    valuationLow,
    valuationHigh,
    ebitdaMultipleLow: finalMultipleLow,
    ebitdaMultipleHigh: finalMultipleHigh,
    estimatedEbitda,
    factors,
  };
}

/** Format a number as compact currency (e.g., $2.5M, $450K) */
export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `$${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const thousands = value / 1_000;
    return `$${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}
