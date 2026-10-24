import {
  calculateFinTwin,
  FinancialInput,
} from "./finTwin";

export function calculateBreakingPoint(
  input: FinancialInput
) {
  const result = calculateFinTwin(input);

  const availableCashFlow = result.monthlyCashFlow;

  return {
    maxIncomeReduction: Math.max(
      0,
      availableCashFlow
    ),
    maxAdditionalExpense: Math.max(
      0,
      availableCashFlow
    ),
    alreadyUnsustainable: availableCashFlow < 0,
  };
}