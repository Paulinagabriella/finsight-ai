
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface FinTwinData {
  monthlyPayment: number;
  monthlyCashFlow: number;
  projectedSavings: {
    month: number;
    savings: number;
  }[];
}

interface FinTwinDashboardProps {
  data: FinTwinData;
}

export default function FinTwinDashboard({
  data,
}: FinTwinDashboardProps) {
  const formatMoney = (value: number) =>
    value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  return (
    <section className="rounded-2xl border p-6">
      <h2 className="text-2xl font-bold">
        Your Financial Twin
      </h2>

      <p className="mt-2 opacity-70">
        See how this financial decision could
        affect your monthly budget and savings.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-4">
          <p className="text-sm opacity-70">
            Monthly Loan Payment
          </p>
          <p className="mt-2 text-2xl font-bold">
            {formatMoney(data.monthlyPayment)}
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm opacity-70">
            Monthly Cash Flow
          </p>
          <p
            className={`mt-2 text-2xl font-bold ${
              data.monthlyCashFlow >= 0
                ? "text-teal-500"
                : "text-red-500"
            }`}
          >
            {formatMoney(data.monthlyCashFlow)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">
          Projected Savings Over 12 Months
        </h3>

        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.projectedSavings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                label={{
                  value: "Month",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                tickFormatter={(value: number) =>
                  `$${value.toLocaleString()}`
                }
                width={85}
              />
              <Tooltip
                formatter={(value) =>
                  formatMoney(Number(value))
                }
              />
              <Line
                type="monotone"
                dataKey="savings"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="mt-4 text-xs opacity-60">
        Projection assumes constant income and
        expenses, with no additional savings
        interest or unexpected costs.
      </p>
    </section>
  );
}