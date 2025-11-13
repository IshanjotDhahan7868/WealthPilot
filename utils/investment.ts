export interface InvestmentPackage {
  name: string;
  expectedReturn: number; // annual rate as a decimal (e.g. 0.05 = 5%)
  risk: string;
  description: string;
}

// Default package definitions matching the UI descriptions.
export const packages: InvestmentPackage[] = [
  {
    name: 'Conservative',
    expectedReturn: 0.03,
    risk: 'Low',
    description: 'Capital preservation first. Mostly bonds and high-grade income.',
  },
  {
    name: 'Balanced',
    expectedReturn: 0.05,
    risk: 'Medium',
    description: 'Blend of equities and bonds for smoother long-term growth.',
  },
  {
    name: 'Growth',
    expectedReturn: 0.07,
    risk: 'High',
    description: 'Mostly equities with some stabilisers. Built for long horizons.',
  },
  {
    name: 'Aggressive',
    expectedReturn: 0.09,
    risk: 'Very High',
    description: 'Equity-heavy and volatile, aiming for maximum long-run upside.',
  },
];

export interface ProjectionResult {
  labels: string[];
  values: number[];
  totalContributions: number;
  futureValue: number;
  realValue: number;
}

/**
 * Calculate a projection given starting balance, monthly contribution, years,
 * inflation and a package index. Returns labels and values for charting
 * as well as summary metrics.
 */
export function runProjection(
  startingBalance: number,
  monthlyContribution: number,
  years: number,
  inflationPercent: number,
  packageIndex: number
): ProjectionResult {
  const pkg = packages[packageIndex] ?? packages[0];
  const expected = pkg.expectedReturn;
  let balance = startingBalance;
  const labels: string[] = [];
  const values: number[] = [];
  for (let year = 0; year <= years; year++) {
    labels.push(year.toString());
    if (year === 0) {
      values.push(balance);
      continue;
    }
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + expected / 12) + monthlyContribution;
    }
    values.push(balance);
  }
  const totalContributions = startingBalance + monthlyContribution * years * 12;
  const futureValue = balance;
  const realValue = futureValue / Math.pow(1 + inflationPercent / 100, years);
  return { labels, values, totalContributions, futureValue, realValue };
}

/**
 * Estimate net worth after a certain number of years given a monthly
 * investment and package. Used in the budget calculator.
 */
export function estimateNetWorth(
  monthlyInvestment: number,
  packageIndex: number,
  years = 20
): number {
  const pkg = packages[packageIndex] ?? packages[0];
  const expected = pkg.expectedReturn;
  let balance = 0;
  for (let y = 0; y < years; y++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + expected / 12) + monthlyInvestment;
    }
  }
  return balance;
}