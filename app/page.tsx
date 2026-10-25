'use client';
import TrustGraphResults from "../components/TrustgraphResults";
import FinTwinDashboard from "../components/FinTwinDashboard";
import BreakingPoint from "../components/BreakingPoint";
import DecisionPassport from "../components/DecisionPassport";
import { useMemo, useState } from 'react';
import {
    ShieldCheck,
    ChartNoAxesCombined,
    BrainCircuit,
    Activity,
    Download,
} from 'lucide-react';
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine,
} from 'recharts';
import { analyzeOffer, calculate, FinancialInputs } from '../lib/finance';

/* ---------- Types ---------- */

type Tab = 'investigate' | 'simulate' | 'reflect' | 'passport';

type AnalysisResponse = {
  success: boolean;
  finTwin: {
    monthlyPayment: number;
    monthlyCashFlow: number;
    projectedSavings: {
      month: number;
      savings: number;
    }[];
  };
  breakingPoint: {
    maxIncomeReduction: number;
    maxAdditionalExpense: number;
    alreadyUnsustainable: boolean;
    monthsUntilSavingsDepleted: number | null;
    riskLevel: "low" | "moderate" | "high";
  };
  trustGraph: {
    interestRates: number[];
    promotionalOffer: boolean;
    detectedFees: string[];
    warnings: string[];
    verified: boolean;
  };
  priority: string | null;
};

/* ---------- Constants ---------- */

const INITIAL_INPUTS: FinancialInputs = {
    income: 2200,
    expenses: 1350,
    savings: 1800,
    price: 1500,
    months: 6,
    apr: 0,
    shock: 500,
    incomeDrop: 20,
};

const SAMPLE_OFFER =
    '0% interest for 6 months. Six monthly payments. Late payment fee may apply. Promotional rate is subject to eligibility. See complete terms for details.';

const FEATURES = [
    { name: 'TrustGraph', desc: 'Analyze offer language', icon: <ShieldCheck /> },
    { name: 'FinTwin', desc: 'Stress-test your finances', icon: <ChartNoAxesCombined /> },
    { name: 'DecisionDNA', desc: 'Challenge your assumptions', icon: <BrainCircuit /> },
];

const TABS: [Tab, string][] = [
    ['investigate', '1 · Investigate'],
    ['simulate', '2 · Simulate'],
    ['reflect', '3 · Reflect'],
    ['passport', '4 · Decision Passport'],
];

const INPUT_FIELDS = [
    ['income', 'Monthly income', '$'],
    ['expenses', 'Monthly expenses', '$'],
    ['savings', 'Starting savings', '$'],
    ['price', 'Amount financed', '$'],
    ['months', 'Repayment months', ''],
    ['apr', 'Annual interest rate', '%'],
    ['shock', 'Emergency expense', '$'],
    ['incomeDrop', 'Income reduction', '%'],
] as const;

const PRIORITY_LABELS: Record<string, string> = {
    emergency: 'emergency savings',
    total: 'total cost',
    access: 'immediate access',
};

const PRIORITY_CHALLENGES: Record<string, string> = {
    emergency:
        'You value financial flexibility. Would you still choose this offer if an emergency expense reduced your cash buffer?',
    total:
        'You prioritize minimizing total cost. Have you compared the full payment amount, fees, and the price of paying upfront?',
    access:
        'You value immediate access. Is the item essential now, and what would delaying the purchase cost you?',
};

const REASON_CHALLENGES: Record<string, string> = {
    lowpayment:
        'A small monthly payment can hide a large total commitment. Compare the total paid and the number of months you remain obligated.',
    interest:
        'An attractive rate is only one part of an offer. Confirm eligibility, fees, and what happens if you miss a payment.',
    need:
        'If the purchase supports school or work, estimate the concrete benefit and compare it with the cash-flow risk.',
};

/* ---------- Helpers ---------- */

const money = (n: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(n);

/* ---------- Page ---------- */

export default function Home() {
    const [inputs, setInputs] = useState(INITIAL_INPUTS);
    
const [inputDrafts, setInputDrafts] = useState<
    Partial<Record<keyof FinancialInputs, string>>
>({});

    const [offer, setOffer] = useState(SAMPLE_OFFER);
    const [priority, setPriority] = useState('emergency');
    const [reason, setReason] = useState('lowpayment');
    const [active, setActive] = useState<Tab>('investigate');
    const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const results = useMemo(() => calculate(inputs), [inputs]);
    
const decisionInsight = useMemo(() => {
    const monthlySurplus = results.normal;
    const monthlyPayment = results.payment;

    if (priority === "emergency") {
        if (results.stressEnding < inputs.savings) {
            return {
                title: "Your emergency savings may be at risk",
                message:
                    "You selected protecting emergency savings as your top priority. However, your stress-test scenario shows savings falling below your starting balance.",
                question:
                    "Would delaying this purchase help you protect your emergency fund?",
                level: "warning",
            };
        }

        return {
            title: "Your savings priority appears supported",
            message:
                "Your simulated savings remain at or above your starting balance in the stress-test scenario. However, unexpected expenses could still affect your financial flexibility.",
            question:
                "How much savings would you want to keep available after making this purchase?",
            level: "info",
        };
    }

    if (priority === "total") {
        if (results.total > inputs.price) {
            return {
                title: "Financing increases your total cost",
                message:
                    `This purchase costs ${money(inputs.price)}, but your simulated total repayment is ${money(results.total)}.`,
                question:
                    "Would paying upfront or choosing a shorter repayment term reduce your overall cost?",
                level: "warning",
            };
        }

        return {
            title: "Review the complete financing cost",
            message:
                "Your simulated repayment does not exceed the purchase amount, but additional fees or promotional conditions may still apply.",
            question:
                "Have you checked the full agreement for fees and conditions?",
            level: "info",
        };
    }

    if (priority === "access") {
        return {
            title:
                monthlySurplus < 0
                    ? "Immediate access may create financial pressure"
                    : "Consider the tradeoff of buying now",
            message:
                monthlySurplus < 0
                    ? `Your estimated monthly cash flow after the payment is ${money(monthlySurplus)}. The purchase may be difficult to sustain.`
                    : `Your estimated monthly payment is ${money(monthlyPayment)}, leaving ${money(monthlySurplus)} in monthly cash flow under the baseline assumptions.`,
            question:
                "Is getting this item immediately worth the financial commitment?",
            level: monthlySurplus < 0 ? "warning" : "info",
        };
    }

    return null;
}, [priority, inputs, results]);

const [generatedInsight, setGeneratedInsight] =
    useState<typeof decisionInsight>(null);

    const hasEmptyInputs = Object.values(inputDrafts).some(
    (value) => value === ""
);

const [analyzedOffer, setAnalyzedOffer] = useState<string | null>(null);

const findings = useMemo(
    () => analyzedOffer === null ? [] : analyzeOffer(analyzedOffer),
    [analyzedOffer]
);


    const warningCount = findings.filter((f) => f.kind === 'warning').length;

    

const update = (key: keyof FinancialInputs, value: number) => {
    setInputs((prev) => ({
        ...prev,
        [key]: Number.isFinite(value) ? Math.max(0, value) : 0,
    }));

    if (key !== "incomeDrop" && key !== "shock") {
        setAnalysis(null);
    }
};



    const exportReport = () => {
        const lines = [
            'FinSight Decision Passport',
            '',
            `Offer: ${offer}`,
            '',
            `Payment: ${money(results.payment)}/month`,
            `Total payments: ${money(results.total)}`,
            `Normal cash flow after payment: ${money(results.normal)}/month`,
            `Stress cash flow after payment: ${money(results.stressed)}/month`,
            `Stress ending savings: ${money(results.stressEnding)}`,
            `Break-even monthly income: ${money(results.breakEvenIncome)}`,
            '',
            'TrustGraph findings:',
            findings.map((f) => `- ${f.title}: ${f.detail}`).join('\n'),
            '',
            `Priority: ${priority}`,
            `Decision reason: ${reason}`,
            '',
            'Educational simulation only. Not financial advice. Terms are not independently verified.',
        ];

        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' }));
        link.download = 'finsight-decision-passport.txt';
        link.click();
        URL.revokeObjectURL(link.href);
    };
    
async function analyzeDecision() {
  setLoading(true);
  setError("");
  setAnalysis(null);

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        income: inputs.income,
        expenses: inputs.expenses,
        savings: inputs.savings,
        purchaseAmount: inputs.price,
        interestRate: inputs.apr,
        termMonths: inputs.months,
        offerText: offer,
        priority: priority,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to analyze decision."
      );
    }

    setAnalysis(data);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
}


    return (
        <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <header className="flex flex-wrap justify-between gap-4 items-center">
                <div>
                    <div className="eyebrow">Financial Decision Intelligence</div>
                    <h1 className="text-4xl font-black mt-1">
                        Fin<span className="text-cyan">Sight</span> AI
                    </h1>
                    <p className="text-muted mt-2">
                        Investigate the facts. Simulate the future. Challenge your thinking.
                    </p>
                </div>
                <span className="pill">Hackathon prototype · Sample data</span>
            </header>

            {/* Feature cards */}
            <section className="grid md:grid-cols-3 gap-4">
                {FEATURES.map((f) => (
                    <div className="panel flex gap-3 items-center" key={f.name}>
                        <span className="text-cyan">{f.icon}</span>
                        <div>
                            <b>{f.name}</b>
                            <p className="hint">{f.desc}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Tabs */}
            <nav className="flex flex-wrap gap-2">
                {TABS.map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setActive(key)}
                        className={
                            'rounded-xl px-4 py-2 text-sm font-bold ' +
                            (active === key ? 'bg-cyan text-night' : 'bg-panel text-muted')
                        }
                    >
                        {label}
                    </button>
                ))}
            </nav>

            {/* 1 · Investigate */}
            {active === 'investigate' && (
                <section className="grid lg:grid-cols-2 gap-5">
                    <div className="panel space-y-4">
                        <div className="eyebrow">TrustGraph</div>
                        <h2 className="text-2xl font-bold">Investigate an offer</h2>
                        <p className="hint">
                            Paste the terms from a financing offer. The local rules engine flags phrases and
                            missing disclosures; it does not verify the lender or authenticate claims.
                        </p>
                        <textarea rows={10} value={offer} onChange={(e) => setOffer(e.target.value)} />
                          
<button
    type="button"
    className="action"
    onClick={() => {
        setAnalyzedOffer(offer);
        setAnalysis(null);
    }}
>
    Analyze Offer
</button>
  
                        <button className="action" onClick={() => setActive('simulate')}>
                            Continue to simulation →
                        </button>
                    </div>

                    <div className="panel space-y-3">
                        <h3 className="text-xl font-bold">Detected findings</h3>
                        
{analyzedOffer === null ? (
    <p className="hint">
        Paste a financing offer and click Analyze Offer
        to see the detected findings.
    </p>
) : analyzedOffer !== offer ? (
    <p className="hint text-amber-300">
        You've changed the offer. Click Analyze Offer
        again to see updated findings.
    </p>
) : findings.length === 0 ? (
    <p className="hint">
        No findings detected. Review the complete
        financing agreement before making a decision.
    </p>
) : (
    findings.map((f, i) => (
        <div
            key={i}
            className="bg-night rounded-xl p-4 border border-slate-700"
        >
            <p
                className={
                    "font-bold " +
                    (f.kind === "warning"
                        ? "text-amber-300"
                        : "text-cyan")
                }
            >
                {f.kind === "warning" ? "⚠ " : "ⓘ "}
                {f.title}
            </p>

            <p className="hint mt-1">
                {f.detail}
            </p>
        </div>
    ))
)}

                        
{analysis && (
    <TrustGraphResults
        data={analysis.trustGraph}
    />
)}

                        <p className="hint">
                            Missing information is not evidence of fraud. Always consult the official agreement.
                        </p>
                    </div>
                </section>
            )}

            {/* 2 · Simulate */}
            {active === 'simulate' && (
                <section className="grid lg:grid-cols-5 gap-5">
                    {/* Inputs */}
                    <div className="panel lg:col-span-2 space-y-4">
                        <div className="eyebrow">FinTwin</div>
                        <h2 className="text-2xl font-bold">Your financial twin</h2>

                        {INPUT_FIELDS.map(([key, label, suffix]) => (
                            <label key={key} className="block">
                                <span className="hint">
                                    {label} {suffix && `(${suffix})`}
                                </span>
                                


<input
    type="number"
    min="0"
    max={key === "incomeDrop" ? 100 : undefined}
    value={inputDrafts[key] ?? inputs[key]}
    onChange={(e) => {
        const text = e.target.value;

        setInputDrafts((prev) => ({
            ...prev,
            [key]: text,
        }));

        if (text === "") {
            setAnalysis(null);
            return;
        }

        const number = Number(text);

        if (Number.isFinite(number) && number >= 0) {
            update(key, number);
        }
    }}
    
onBlur={() => {
    if (inputDrafts[key] === "") return;

    setInputDrafts((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
    });
}}

    onWheel={(e) => e.currentTarget.blur()}
    className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
/>



                            
                            </label>
                        ))}

                        <button
                            type="button"
                            className={`action w-full transition-all duration-200 ${
                                loading || hasEmptyInputs
                                    ? "opacity-40 cursor-not-allowed grayscale"
                                    : "opacity-100 cursor-pointer hover:brightness-110"
                            }`}
                            disabled={loading || hasEmptyInputs}
                            onClick={analyzeDecision}
                        >
                            {loading
                                ? "Analyzing..."
                                : "Analyze My Decision →"}
                        </button>
                    </div>


                    {/* Results */}
                    <div className="lg:col-span-3 space-y-5">
                        
{error && (
    <p className="text-red-400">
        {error}
    </p>
)}

{analysis && (
    <FinTwinDashboard
        data={analysis.finTwin}
    />
)}

                        <div className="grid sm:grid-cols-2 gap-3">
                            {[
                                ['Monthly payment', money(results.payment)],
                                ['Total paid', money(results.total)],
                                ['Normal monthly surplus', money(results.normal)],
                                ['Stressed ending savings', money(results.stressEnding)],
                            ].map(([label, value]) => (
                                <div className="stat" key={label}>
                                    <p className="hint">{label}</p>
                                    <p className="text-2xl font-bold mt-1">{value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="panel">
                            <h3 className="text-lg font-bold mb-3">Possible savings paths</h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={results.points}>
                                        <CartesianGrid stroke="#263952" />
                                        <XAxis dataKey="month" stroke="#a5b4c9" />
                                        <YAxis stroke="#a5b4c9" />
                                        <Tooltip
                                            contentStyle={{ background: '#141e34', border: '1px solid #34455e' }}
                                            formatter={(v) => money(Number(v))}
                                        />
                                        <Legend />
                                        <ReferenceLine y={0} stroke="#f87171" strokeDasharray="4 4" />
                                        <Line type="monotone" dataKey="baseline" stroke="#a5b4c9" name="No purchase" dot={false} />
                                        <Line type="monotone" dataKey="financed" stroke="#60e8d3" name="Financed" dot={false} />
                                        <Line type="monotone" dataKey="stress" stroke="#fbbf24" name="Stress test" dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="hint">
                                Illustrative fixed-income scenarios, not predictions. Stress expense occurs in month 3.
                            </p>
                        </div>


                        
{analysis && (
    <BreakingPoint
        data={{
            breakEvenIncome:
                inputs.expenses + analysis.finTwin.monthlyPayment,

            maxIncomeReduction:
                inputs.income > 0
                    ? (analysis.breakingPoint.maxIncomeReduction /
                        inputs.income) * 100
                    : 0,

            maxAdditionalExpense:
                analysis.breakingPoint.maxAdditionalExpense,

            monthlyCashFlow:
                analysis.finTwin.monthlyCashFlow,

            stressedCashFlow:
                analysis.finTwin.monthlyCashFlow -
                (inputs.income * inputs.incomeDrop) / 100,

            incomeDrop: inputs.incomeDrop,

            alreadyUnsustainable:
                analysis.breakingPoint.alreadyUnsustainable,

            monthsUntilSavingsDepleted:
                analysis.breakingPoint.monthsUntilSavingsDepleted,

            riskLevel:
                analysis.breakingPoint.riskLevel,
        }}
        onIncomeDropChange={(value) =>
            update("incomeDrop", value)
        }
    />
)}

                    </div>
                </section>
            )}

            {/* 3 · Reflect */}
            {active === 'reflect' && (
                <section className="grid lg:grid-cols-2 gap-5">
                    <div className="panel space-y-5">
                        <div className="eyebrow">DecisionDNA</div>
                        <h2 className="text-2xl font-bold">Understand your reasoning</h2>

                        <label className="block">
                            <p className="mb-2 font-bold">What matters most?</p>
                            <select
    value={priority}
    onChange={(e) => {
        setPriority(e.target.value);
    }}
>
                                <option value="emergency">Protecting emergency savings</option>
                                <option value="total">Minimizing total cost</option>
                                <option value="access">Getting the item immediately</option>
                            </select>
                        </label>

                        <label className="block">
                            <p className="mb-2 font-bold">Why does this offer appeal to you?</p>
                            <select
    value={reason}
    onChange={(e) => {
        setReason(e.target.value);
    }}
>
                                <option value="lowpayment">The monthly payment seems small</option>
                                <option value="interest">The advertised interest rate</option>
                                <option value="need">I need the item for work or school</option>
                            </select>
                        </label>


<button
    type="button"
    className="action"
    onClick={() => setGeneratedInsight(decisionInsight)}
>
    Generate My Insights →
</button>


                        <button className="action" onClick={() => setActive('passport')}>
                            Generate decision passport →
                        </button>
                    </div>

                    

<div className="panel space-y-4">
    <h3 className="text-xl font-bold">
        Your DecisionDNA Insights
    </h3>

    {!generatedInsight && (
        <p className="hint">
            Select your financial priority and explain what
            appeals to you about this offer. Then click
            Generate My Insights to see your personalized
            DecisionDNA analysis.
        </p>
    )}

    {generatedInsight && (
        <div
            className={`rounded-xl border p-4 space-y-3 ${
                generatedInsight.level === "warning"
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-cyan-500 bg-cyan-500/10"
            }`}
        >
            <h4 className="text-lg font-bold">
                {generatedInsight.level === "warning" ? "⚠ " : "ⓘ "}
                {generatedInsight.title}
            </h4>

            <p>{generatedInsight.message}</p>

            <div className="border-t border-slate-700 pt-3">
                <p className="font-semibold">
                    Something to consider:
                </p>
                <p className="hint mt-1">
                    {generatedInsight.question}
                </p>
            </div>
        </div>
    )}

    <p className="hint">
        These insights are based on your financial inputs and
        selected priorities. They are educational simulations,
        not financial advice or psychological assessments.
    </p>
</div>


                </section>
            )}

            
{/* 4 · Decision Passport */}
{active === "passport" && analysis && (
    <DecisionPassport
        inputs={inputs}
        results={results}
        findings={findings}
        priority={priority}
        reason={reason}
        riskLevel={analysis.breakingPoint.riskLevel}
        analysis={analysis}
    />
)}


            {/* Footer */}
            <footer className="text-center text-muted text-xs py-6">
                FinSight AI · Hackathon prototype · All values illustrative · No bank connections
            </footer>
        </main>
    );
}