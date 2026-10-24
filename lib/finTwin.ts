export interface FinancialInput {
  income: number;
  expenses: number;
  savings: number;
  purchaseAmount: number;
  interestRate: number;
  termMonths: number;
}

export function calculateFinTwin(input: FinancialInput) {
  const {
    income,
    expenses,
    savings,
    purchaseAmount,
    interestRate,
    termMonths,
  } = input;

  if (
    !Object.values(input).every(Number.isFinite) ||
    income < 0 ||
    expenses < 0 ||
    savings < 0 ||
    purchaseAmount < 0 ||
    interestRate < 0 ||
    termMonths <= 0 ||
    !Number.isInteger(termMonths)
  ) {
    throw new Error("Invalid financial input");
  }

  const monthlyRate = interestRate / 100 / 12;

  const monthlyPayment =
    monthlyRate === 0
      ? purchaseAmount / termMonths
      : (purchaseAmount * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -termMonths));

  const monthlyCashFlow = income - expenses - monthlyPayment;

  const projectedSavings = Array.from(
    { length: 13 },
    (_, month) => ({
      month,
      savings: Number(
        (
          savings +
          monthlyCashFlow * Math.min(month, termMonths) +
          (income - expenses) * Math.max(0, month - termMonths)
        ).toFixed(2)
      ),
    })
  );

  return {
    monthlyPayment: Number(monthlyPayment.toFixed(2)),
    monthlyCashFlow: Number(monthlyCashFlow.toFixed(2)),
    projectedSavings,
  };
}