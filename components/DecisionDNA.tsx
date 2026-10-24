
"use client";

import { useState } from "react";

export type FinancialPriority =
    | "saving"
    | "flexibility"
    | "low-risk"
    | "growth";

type DecisionDNAProps = {
    onComplete?: (priority: FinancialPriority) => void;
};

const options: {
    value: FinancialPriority;
    title: string;
    description: string;
}[] = [
        {
            value: "saving",
            title: "Build My Savings",
            description: "I want to protect and grow my savings.",
        },
        {
            value: "flexibility",
            title: "Financial Flexibility",
            description: "I want more freedom with my monthly budget.",
        },
        {
            value: "low-risk",
            title: "Minimize Risk",
            description: "I prefer predictable financial decisions.",
        },
        {
            value: "growth",
            title: "Long-Term Growth",
            description: "I am comfortable with some uncertainty.",
        },
    ];

export default function DecisionDNA({
    onComplete,
}: DecisionDNAProps) {
    const [priority, setPriority] =
        useState<FinancialPriority>("saving");

    return (
        <section className="rounded-2xl border p-6">
            <h2 className="text-2xl font-bold">
                Discover Your DecisionDNA
            </h2>

            <p className="mt-2 text-gray-500">
                What matters most to you when making
                a financial decision?
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => setPriority(option.value)}
                        className={`rounded-xl border p-4 text-left transition ${priority === option.value
                                ? "border-teal-500 bg-teal-500/10"
                                : "border-gray-300 hover:border-teal-400"
                            }`}
                    >
                        <h3 className="font-semibold">
                            {option.title}
                        </h3>

                        <p className="mt-1 text-sm opacity-70">
                            {option.description}
                        </p>
                    </button>
                ))}
            </div>

            <button
                type="button"
                onClick={() => {
                    console.log("Selected priority:", priority);
                    onComplete?.(priority);
                }}
                className="mt-6 rounded-lg bg-teal-500 px-6 py-3 font-semibold text-black"
            >
                Save My Preferences
            </button>
        </section>
    );
}