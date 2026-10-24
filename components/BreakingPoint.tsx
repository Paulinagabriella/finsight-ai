
"use client";

export interface BreakingPointData {
    breakEvenIncome: number;
    maxIncomeReduction: number;
    maxAdditionalExpense: number;
    monthlyCashFlow: number;
    stressedCashFlow: number;
    incomeDrop: number;
    alreadyUnsustainable: boolean;
    monthsUntilSavingsDepleted: number | null;
    riskLevel: "low" | "moderate" | "high";
}

interface BreakingPointProps {
    data: BreakingPointData;
    onIncomeDropChange: (value: number) => void;
}

export default function BreakingPoint({
    data,
    onIncomeDropChange,
}: BreakingPointProps) {
    const money = (value: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
        }).format(value);

    const riskColors = {
        low: "text-cyan",
        moderate: "text-amber-300",
        high: "text-red-400",
    };

    return (
        <section className="panel space-y-5">
            <div>
                <div className="eyebrow">FinTwin · Stress Test</div>
                <h2 className="text-2xl font-bold">
                    The Financial Breaking Point
                </h2>
                <p className="hint mt-2">
                    Explore how much financial pressure your budget
                    can withstand before your monthly cash flow
                    turns negative.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
                <div className="stat">
                    <p className="hint">Break-even monthly income</p>
                    <p className="text-2xl font-bold mt-1">
                        {money(data.breakEvenIncome)}
                    </p>
                </div>

                <div className="stat">
                    <p className="hint">Maximum income reduction</p>
                    <p className="text-2xl font-bold mt-1">
                        {data.maxIncomeReduction.toFixed(1)}%
                    </p>
                </div>

                <div className="stat">
                    <p className="hint">Additional monthly expense limit</p>
                    <p className="text-2xl font-bold mt-1">
                        {money(data.maxAdditionalExpense)}
                    </p>
                </div>

                <div className="stat">
                    <p className="hint">Current monthly cash flow</p>
                    <p className="text-2xl font-bold mt-1">
                        {money(data.monthlyCashFlow)}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <label className="block">
                    <span className="font-bold">
                        Simulate an income reduction: {data.incomeDrop}%
                    </span>

                    <input
                        className="mt-3"
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={data.incomeDrop}
                        onChange={(event) =>
                            onIncomeDropChange(Number(event.target.value))
                        }
                    />
                    <span className="hint flex justify-between">
                        <span>0% reduction</span>
                        <span>100% reduction</span>
                    </span>
                </label>

                <div className="rounded-xl bg-night border border-slate-700 p-4">
                    <p className="hint">Cash flow after income reduction</p>

                    <p
                        className={`text-2xl font-bold mt-1 ${data.stressedCashFlow < 0
                                ? "text-amber-300"
                                : "text-cyan"
                            }`}
                    >
                        {money(data.stressedCashFlow)}/month
                    </p>

                    <p className="mt-2">
                        {data.stressedCashFlow < 0
                            ? "⚠ Your monthly expenses exceed your income in this scenario."
                            : "✓ Your monthly cash flow remains nonnegative in this scenario."}
                    </p>
                </div>
            </div>

            <div className="rounded-xl border border-slate-700 p-4">
                <h3 className="font-bold">Financial Risk Assessment</h3>

                <p
                    className={`text-xl font-bold mt-2 ${riskColors[data.riskLevel]
                        }`}
                >
                    {data.riskLevel.toUpperCase()} RISK
                </p>

                <p className="hint mt-2">
                    {data.alreadyUnsustainable
                        ? "Your current monthly cash flow is negative."
                        : "Your baseline monthly cash flow is nonnegative."}
                </p>

                {data.monthsUntilSavingsDepleted !== null && (
                    <p className="hint mt-2">
                        Estimated savings runway:{" "}
                        {data.monthsUntilSavingsDepleted} months
                    </p>
                )}
            </div>

            <p className="hint text-xs">
                Estimates depend on the financial inputs and financing
                assumptions. This educational simulation is not financial
                advice.
            </p>
        </section>
    );
}