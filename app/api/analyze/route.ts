
import { NextResponse } from "next/server";

import {
  calculateFinTwin,
  type FinancialInput,
} from "../../../lib/finTwin";

import { calculateBreakingPoint } from "../../../lib/breakingPoint";

import { analyzeTrustGraph } from "../../../lib/trustGraph";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const input: FinancialInput = {
      income: body.income,
      expenses: body.expenses,
      savings: body.savings,
      purchaseAmount: body.purchaseAmount,
      interestRate: body.interestRate,
      termMonths: body.termMonths,
    };

    // Validate financial inputs
    const values = Object.values(input);

    if (
      !values.every(
        (value) =>
          typeof value === "number" &&
          Number.isFinite(value)
      ) ||
      input.income < 0 ||
      input.expenses < 0 ||
      input.savings < 0 ||
      input.purchaseAmount < 0 ||
      input.interestRate < 0 ||
      !Number.isInteger(input.termMonths) ||
      input.termMonths <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid financial information." },
        { status: 400 }
      );
    }

    if (typeof body.offerText !== "string") {
      return NextResponse.json(
        { error: "Financial offer text is required." },
        { status: 400 }
      );
    }

    // Run all three analysis features
    const finTwin = calculateFinTwin(input);

    const breakingPoint = calculateBreakingPoint(input);

    const trustGraph = analyzeTrustGraph(body.offerText);

    return NextResponse.json({
      success: true,
      finTwin,
      breakingPoint,
      trustGraph,
      priority: body.priority ?? null,
    });
  } catch (error) {
    console.error("Analysis error:", error);

    return NextResponse.json(
      { error: "Unable to analyze financial information." },
      { status: 400 }
    );
  }
}
