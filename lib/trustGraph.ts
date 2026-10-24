
export interface TrustGraphResult {
  interestRates: number[];
  promotionalOffer: boolean;
  detectedFees: string[];
  warnings: string[];
  verified: boolean;
}

export function analyzeTrustGraph(
  offerText: string
): TrustGraphResult {
  const text = offerText.toLowerCase();
  const warnings: string[] = [];
  const detectedFees: string[] = [];

  // Extract percentages from the offer
  const rateMatches = [
    ...text.matchAll(/(\d+(?:\.\d+)?)\s*%/g),
  ];

  const interestRates = rateMatches.map(
    (match) => Number(match[1])
  );

  // Identify promotional offers
  const promotionalOffer =
    /introductory|promotional|limited.time|0%\s*apr/.test(
      text
    );

  // Identify common fees
  const fees = [
    "late fee",
    "annual fee",
    "origination fee",
    "prepayment penalty",
    "balance transfer fee",
  ];

  for (const fee of fees) {
    if (text.includes(fee)) {
      detectedFees.push(fee);
    }
  }

  // Flag possible risks
  if (interestRates.length === 0) {
    warnings.push("No interest rate was identified.");
  }

  if (promotionalOffer) {
    warnings.push(
      "Promotional terms detected. Check when the offer expires."
    );
  }

  if (interestRates.some((rate) => rate >= 25)) {
    warnings.push(
      "A potentially high interest rate was detected."
    );
  }

  if (!text.includes("fee")) {
    warnings.push(
      "No fee information was identified. Check for additional charges."
    );
  }

  return {
    interestRates,
    promotionalOffer,
    detectedFees,
    warnings,
    verified: false,
  };
}
