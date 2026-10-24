'use client';

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
    const [offer, setOffer] = useState(SAMPLE_OFFER);
    const [priority, setPriority] = useState('emergency');
    const [reason, setReason] = useState('lowpayment');
    const [active, setActive] = useState<Tab>('investigate');

    const results = useMemo(() => calculate(inputs), [inputs]);
    const findings = useMemo(() => analyzeOffer(offer), [offer]);

    const warningCount = findings.filter((f) => f.kind === 'warning').length;

    const update = (key: keyof FinancialInputs, value: number) =>
        setInputs((prev) => ({
            ...prev,
            [key]: Number.isFinite(value) ? Math.max(0, value) : 0,
        }));

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
                        <button className="action" onClick={() => setActive('simulate')}>
                            Continue to simulation →
                        </button>
                    </div>

                    <div className="panel space-y-3">
                        <h3 className="text-xl font-bold">Detected findings</h3>
                        {findings.map((f, i) => (
                            <div key={i} className="bg-night rounded-xl p-4 border border-slate-700">
                                <p className={'font-bold ' + (f.kind === 'warning' ? 'text-amber-300' : 'text-cyan')}>
                                    {f.kind === 'warning' ? '⚠ ' : 'ⓘ '}
                                    {f.title}
                                </p>
                                <p className="hint mt-1">{f.detail}</p>
                            </div>
                        ))}
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
                                    max={key === 'incomeDrop' ? 100 : undefined}
                                    value={inputs[key]}
                                    onChange={(e) => update(key, Number(e.target.value))}
                                />
                            </label>
                        ))}

                        <button className="action" onClick={() => setActive('reflect')}>
                            Continue to DecisionDNA →
                        </button>
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-3 space-y-5">
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

                        <div className="panel space-y-3">
                            <div className="eyebrow">The Financial Breaking Point</div>
                            <p className="text-3xl font-bold">
                                {money(results.breakEvenIncome)}{' '}
                                <span className="text-base text-muted">monthly income</span>
                            </p>
                            <p className="hint">
                                Below this income, monthly cash flow after expenses and the payment turns negative.
                                With current inputs, that's a {results.maxDrop.toFixed(1)}% income decrease.
                            </p>
                            <label className="block">
                                Income reduction: <b>{inputs.incomeDrop}%</b>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={inputs.incomeDrop}
                                    onChange={(e) => update('incomeDrop', Number(e.target.value))}
                                />
                            </label>
                            <p className={results.stressed < 0 ? 'text-amber-300 font-bold' : 'text-cyan font-bold'}>
                                {results.stressed < 0
                                    ? '⚠ Negative stressed monthly cash flow'
                                    : '✓ Nonnegative stressed monthly cash flow'}
                                : {money(results.stressed)}
                            </p>
                        </div>
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
                            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option value="emergency">Protecting emergency savings</option>
                                <option value="total">Minimizing total cost</option>
                                <option value="access">Getting the item immediately</option>
                            </select>
                        </label>

                        <label className="block">
                            <p className="mb-2 font-bold">Why does this offer appeal to you?</p>
                            <select value={reason} onChange={(e) => setReason(e.target.value)}>
                                <option value="lowpayment">The monthly payment seems small</option>
                                <option value="interest">The advertised interest rate</option>
                                <option value="need">I need the item for work or school</option>
                            </select>
                        </label>

                        <button className="action" onClick={() => setActive('passport')}>
                            Generate decision passport →
                        </button>
                    </div>

                    <div className="panel space-y-4">
                        <h3 className="text-xl font-bold">Your decision challenge</h3>
                        <p>{PRIORITY_CHALLENGES[priority]}</p>
                        <p>{REASON_CHALLENGES[reason]}</p>
                        <p className="hint">
                            These observations are based on your answers, not a psychological diagnosis or
                            inferred personality profile.
                        </p>
                    </div>
                </section>
            )}

            {/* 4 · Decision Passport */}
            {active === 'passport' && (
                <section className="panel space-y-5">
                    <div className="flex justify-between items-start gap-3 flex-wrap">
                        <div>
                            <div className="eyebrow">Unified decision report</div>
                            <h2 className="text-3xl font-bold">Your Decision Passport</h2>
                        </div>
                        <button className="action flex gap-2 items-center" onClick={exportReport}>
                            <Download size={16} /> Export report
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="stat">
                            <ShieldCheck className="text-cyan mb-2" />
                            <b>TrustGraph</b>
                            <p className="hint mt-2">
                                {warningCount} warnings and {findings.length} total findings. Terms are unverified.
                            </p>
                        </div>
                        <div className="stat">
                            <Activity className="text-cyan mb-2" />
                            <b>FinTwin</b>
                            <p className="hint mt-2">
                                {money(results.payment)}/month; stressed ending savings {money(results.stressEnding)}.
                            </p>
                        </div>
                        <div className="stat">
                            <BrainCircuit className="text-cyan mb-2" />
                            <b>DecisionDNA</b>
                            <p className="hint mt-2">Primary priority: {PRIORITY_LABELS[priority]}.</p>
                        </div>
                    </div>

                    <div className="bg-night rounded-xl p-5 space-y-2">
                        <h3 className="font-bold text-xl">Before you decide</h3>
                        <p>1. Confirm the complete official repayment terms and any fees.</p>
                        <p>2. Check whether your budget remains workable after an income reduction or emergency.</p>
                        <p>3. Compare this offer with paying upfront, waiting, or a lower-cost alternative.</p>
                        <p>4. Decide whether the tradeoffs align with your stated priorities.</p>
                    </div>

                    <p className="hint">
                        Educational decision-support prototype. No financial advice, live market verification,
                        or personalized investment recommendation. Inputs stay in this browser session.
                    </p>
                    <button className="action" onClick={() => setActive('simulate')}>
                        ← Run another stress test
                    </button>
                </section>
            )}

            {/* Footer */}
            <footer className="text-center text-muted text-xs py-6">
                FinSight AI · Hackathon prototype · All values illustrative · No bank connections
            </footer>
        </main>
    );
}