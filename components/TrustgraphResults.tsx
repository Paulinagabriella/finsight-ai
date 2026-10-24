
"use client";

export interface TrustGraphData {
    interestRates: number[];
    promotionalOffer: boolean;
    detectedFees: string[];
    warnings: string[];
    verified: boolean;
}

interface TrustGraphResultsProps {
    data: TrustGraphData;
}

export default function TrustGraphResults({
    data,
}: TrustGraphResultsProps) {
    return (
        <section className="rounded-2xl border p-6">
            <h2 className="text-2xl font-bold">
                TrustGraph Analysis
            </h2>

            <p className="mt-2 text-sm opacity-70">
                Understand the important terms and risks
                in your financial offer.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-4">
                    <h3 className="font-semibold">
                        Interest Rates Detected
                    </h3>

                    <p className="mt-2 text-2xl font-bold text-teal-500">
                        {data.interestRates.length > 0
                            ? data.interestRates
                                .map((rate) => `${rate}%`)
                                .join(", ")
                            : "Not found"}
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <h3 className="font-semibold">
                        Promotional Offer
                    </h3>

                    <p className="mt-2 text-lg">
                        {data.promotionalOffer
                            ? "Yes — Review the conditions"
                            : "Not detected"}
                    </p>
                </div>
            </div>

            <div className="mt-4 rounded-xl border p-4">
                <h3 className="font-semibold">
                    Fees Detected
                </h3>

                {data.detectedFees.length > 0 ? (
                    <ul className="mt-2 list-disc pl-5">
                        {data.detectedFees.map((fee) => (
                            <li key={fee}>{fee}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-2 opacity-70">
                        No fees identified. Check the full offer.
                    </p>
                )}
            </div>

            <div className="mt-4 rounded-xl border border-amber-500/50 bg-amber-500/10 p-4">
                <h3 className="font-semibold">
                    Financial Warnings
                </h3>

                {data.warnings.length > 0 ? (
                    <ul className="mt-2 list-disc space-y-2 pl-5">
                        {data.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-2">
                        No warnings detected by the current rules.
                    </p>
                )}
            </div>

            <p className="mt-4 text-xs opacity-60">
                Automated analysis only. Terms have not
                been independently verified.
            </p>
        </section>
    );
}