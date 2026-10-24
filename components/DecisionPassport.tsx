
"use client";

import {
    ShieldCheck,
    Activity,
    BrainCircuit,
    Download,
    AlertTriangle,
    CheckCircle2,
    FileText,
} from "lucide-react";

import type { FinancialInputs } from "../lib/finance";

type Finding = {
    kind: string;
    title: string;
    detail: string;
};

type PassportProps = {
    inputs: FinancialInputs;
    results: {
        payment: number;
        total: number;
        normal: number;
        stressed: number;
        stressEnding: number;
        breakEvenIncome: number;
        maxDrop: number;
    };
    findings: Finding[];
    priority: string;
    reason: string;
    riskLevel: string;
};

const money = (value: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(value);

const PRIORITY_LABELS: Record<string, string> = {
    emergency: "Protecting emergency savings",
    total: "Minimizing total cost",
    access: "Getting the item immediately",
};

const REASON_LABELS: Record<string, string> = {
    lowpayment: "The monthly payment seems small",
    interest: "The advertised interest rate",
    need: "I need the item for work or school",
};

export default function DecisionPassport({
    inputs,
    results,
    findings,
    priority,
    reason,
    riskLevel,
}: PassportProps) {
    const warningCount = findings.filter(
        (finding) => finding.kind === "warning"
    ).length;

    const exportReport = () => {
        const report = {
            title: "FinSight AI — Decision Passport",
            generatedAt: new Date().toISOString(),
            disclaimer:
                "Educational simulation only. Not financial advice. Offer terms are not independently verified.",
            financialInputs: inputs,
            financialResults: {
                monthlyPayment: results.payment,
                totalPayments: results.total,
                normalMonthlyCashFlow: results.normal,
                stressedMonthlyCashFlow: results.stressed,
                stressedEndingSavings: results.stressEnding,
                breakEvenIncome: results.breakEvenIncome,
                maximumIncomeDrop: results.maxDrop,
            },
            trustGraph: {
                warningCount,
                totalFindings: findings.length,
                verified: false,
                findings,
            },
            breakingPoint: {
                riskLevel,
                incomeReductionPercent: inputs.incomeDrop,
                emergencyExpense: inputs.shock,
            },
            decisionDNA: {
                priority: PRIORITY_LABELS[priority] ?? priority,
                reason: REASON_LABELS[reason] ?? reason,
            },
        };

        const blob = new Blob(
            [JSON.stringify(report, null, 2)],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "finsight-decision-passport.json";
        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    };

    const stats = [
        {
            label: "Monthly payment",
            value: money(results.payment),
        },
        {
            label: "Total repayment",
            value: money(results.total),
        },
        {
            label: "Normal monthly surplus",
            value: money(results.normal),
        },
        {
            label: "Savings after stress test",
            value: money(results.stressEnding),
        },
    ];

    return (
        <section className="space-y-6">
            {/* Header */}
            <header className="panel flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="eyebrow">Unified decision report</div>
                    <h2 className="mt-1 text-3xl font-black">
                        Your Decision Passport
                    </h2>
                    <p className="hint mt-2">
                        Your offer findings, financial simulations, risk limits,
                        and decision priorities in one place.
                    </p>
                </div>

                <button
                    type="button"
                    className="action flex items-center gap-2"
                    onClick={exportReport}
                >
                    <Download size={17} />
                    Download Passport
                </button>
            </header>

            {/* Financial summary */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <div className="stat" key={stat.label}>
                        <p className="hint">{stat.label}</p>
                        <p className="mt-2 text-2xl font-bold">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Three analysis pillars */}
            <div className="grid gap-4 lg:grid-cols-3">
                <article className="panel space-y-3">
                    <ShieldCheck className="text-cyan" size={26} />
                    <h3 className="text-xl font-bold">TrustGraph</h3>
                    <p className="hint">
                        {warningCount} warning(s), {findings.length} total finding(s).
                    </p>
                    <p className="hint">
                        Offer authenticity and lender terms have not been independently verified.
                    </p>
                </article>

                <article className="panel space-y-3">
                    <Activity className="text-cyan" size={26} />
                    <h3 className="text-xl font-bold">FinTwin</h3>
                    <p>
                        Monthly payment: <b>{money(results.payment)}</b>
                    </p>
                    <p>
                        Normal monthly surplus: <b>{money(results.normal)}</b>
                    </p>
                    <p>
                        Stress-test surplus: <b>{money(results.stressed)}</b>
                    </p>
                </article>

                <article className="panel space-y-3">
                    <BrainCircuit className="text-cyan" size={26} />
                    <h3 className="text-xl font-bold">DecisionDNA</h3>
                    <p className="hint">Your stated priority</p>
                    <p className="font-semibold">
                        {PRIORITY_LABELS[priority] ?? priority}
                    </p>
                    <p className="hint">Why the offer appeals to you</p>
                    <p>
                        {REASON_LABELS[reason] ?? reason}
                    </p>
                </article>
            </div>

            {/* TrustGraph details */}
            <section className="panel space-y-4">
                <div className="flex items-center gap-2">
                    <FileText className="text-cyan" />
                    <h3 className="text-xl font-bold">Offer findings</h3>
                </div>

                {findings.length > 0 ? (
                    findings.map((finding, index) => (
                        <article
                            key={`${finding.title}-${index}`}
                            className="rounded-xl border border-slate-700 bg-night p-4"
                        >
                            <p
                                className={
                                    "font-bold " +
                                    (finding.kind === "warning"
                                        ? "text-amber-300"
                                        : "text-cyan")
                                }
                            >
                                {finding.kind === "warning" ? (
                                    <AlertTriangle className="mr-2 inline" size={17} />
                                ) : (
                                    <CheckCircle2 className="mr-2 inline" size={17} />
                                )}
                                {finding.title}
                            </p>
                            <p className="hint mt-2">{finding.detail}</p>
                        </article>
                    ))
                ) : (
                    <p className="hint">No findings were returned by the current rules engine.</p>
                )}

                <p className="hint">
                    A lack of warnings does not mean an offer is safe.
                    Review the complete official agreement.
                </p>
            </section>

            {/* BreakingPoint */}
            <section className="panel space-y-4">
                <div className="flex items-center gap-2">
                    <Activity className="text-cyan" />
                    <h3 className="text-xl font-bold">BreakingPoint stress test</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-700 p-4">
                        <p className="hint">Current simulated risk</p>
                        <p className="mt-2 text-xl font-bold capitalize">
                            {riskLevel}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-700 p-4">
                        <p className="hint">Break-even monthly income</p>
                        <p className="mt-2 text-xl font-bold">
                            {money(results.breakEvenIncome)}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-700 p-4">
                        <p className="hint">Income reduction tested</p>
                        <p className="mt-2 text-xl font-bold">
                            {inputs.incomeDrop}%
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-700 p-4">
                        <p className="hint">Emergency expense tested</p>
                        <p className="mt-2 text-xl font-bold">
                            {money(inputs.shock)}
                        </p>
                    </div>
                </div>

                <p className="hint">
                    Risk is based on the current simulation assumptions and is not a prediction of future events.
                </p>
            </section>

            {/* Decision checklist */}
            <section className="rounded-2xl border border-slate-700 bg-night p-5">
                <h3 className="text-xl font-bold">Before you decide</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5">
                    <li>Confirm the complete repayment terms and applicable fees.</li>
                    <li>Check your budget after the tested income reduction and emergency expense.</li>
                    <li>Compare the total repayment with paying upfront or choosing a lower-cost option.</li>
                    <li>Consider whether the tradeoffs align with your stated priority.</li>
                </ul>
            </section>

            <p className="hint text-xs">
                FinSight AI is an educational decision-support prototype.
                It does not provide financial advice, verify lenders, or make
                personalized investment recommendations.
            </p>
        </section>
    );
}