
import {
  calculateFinTwin,
  type FinancialInput,
} from "./finTwin";

export interface BreakingPointResult {
  maxIncomeReduction: number;
  maxAdditionalExpense: number;
  alreadyUnsustainable: boolean;
  monthsUntilSavingsDepleted: number | null;
  riskLevel: "low" | "moderate" | "high";
}

export function calculateBreakingPoint(
  input: FinancialInput
): BreakingPointResult {
  const result = calculateFinTwin(input);

  const cashFlow = result.monthlyCashFlow;

  // Maximum monthly income reduction or extra recurring
  // expense before monthly cash flow reaches zero.
  const threshold = Math.max(0, cashFlow);

  // Estimate how long current savings would last if
  // the user's current monthly cash flow is negative.
  const monthsUntilSavingsDepleted =
    cashFlow < 0
      ? input.savings / Math.abs(cashFlow)
      : null;

  // Simple illustrative risk classification.
  const riskLevel =
    cashFlow <= 0
      ? "high"
      : cashFlow < input.income * 0.1
        ? "moderate"
        : "low";

  return {
    maxIncomeReduction: Number(threshold.toFixed(2)),
    maxAdditionalExpense: Number(threshold.toFixed(2)),
    alreadyUnsustainable: cashFlow < 0,
    monthsUntilSavingsDepleted:
      monthsUntilSavingsDepleted === null
        ? null
        : Number(monthsUntilSavingsDepleted.toFixed(1)),
    riskLevel,
  };
}
