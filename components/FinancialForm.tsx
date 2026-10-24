"use client";

import { useState } from "react";

export default function FinancialForm() {
    const [form, setForm] = useState({
        income: 2500,
        expenses: 1500,
        savings: 3000,
        purchaseAmount: 2000,
        interestRate: 12,
        termMonths: 12,
        offerText: "",
    });

    function update(field: keyof typeof form, value: string) {
        setForm((previous) => ({
            ...previous,
            [field]: field === "offerText" ? value : Number(value),
        }));
    }

    return (
        <form
            className="space-y-4 rounded-xl border p-6"
            onSubmit={(e) => {
                e.preventDefault();
                console.log("Financial input:", form);
            }}
        >
            <h2 className="text-2xl font-bold">
                Analyze Your Financial Decision
            </h2>

            {(
                [
                    ["income", "Monthly Income ($)"],
                    ["expenses", "Monthly Expenses ($)"],
                    ["savings", "Current Savings ($)"],
                    ["purchaseAmount", "Loan Amount ($)"],
                    ["interestRate", "Interest Rate (APR %)"],
                    ["termMonths", "Loan Duration (Months)"],
                ] as const
            ).map(([field, label]) => (
                <label key={field} className="block">
                    <span className="mb-1 block">{label}</span>
                    <input
                        type="number"
                        min={0}
                        step={field === "termMonths" ? 1 : "any"}
                        required
                        value={form[field]}
                        onChange={(e) => update(field, e.target.value)}
                        className="w-full rounded-lg border p-3 text-black"
                    />
                </label>
            ))}

            <label className="block">
                <span className="mb-1 block">Financial Offer</span>
                <textarea
                    value={form.offerText}
                    onChange={(e) => update("offerText", e.target.value)}
                    placeholder="Paste your loan or credit offer..."
                    className="w-full rounded-lg border p-3 text-black"
                    rows={4}
                />
            </label>

            <button
                type="submit"
                className="rounded-lg bg-teal-500 px-6 py-3 font-semibold text-black"
            >
                Analyze My Decision
            </button>
        </form>
    );
}