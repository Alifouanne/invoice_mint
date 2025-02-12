/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Graph from "./Graph";
import { prisma } from "@/app/utils/db";
import { reqUser } from "@/app/utils/hooks";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/app/utils/formatCurrency";

const getInvoices = async (userId: string) => {
  const data = await prisma.invoice.findMany({
    where: {
      status: "PAID",
      userId: userId,
      createdAt: {
        lte: new Date(),
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    select: {
      createdAt: true,
      total: true,
      currency: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const aggregatedData = data.reduce((acc: { [key: string]: number }, curr) => {
    const date = new Date(curr.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    acc[date] = (acc[date] || 0) + curr.total;
    return acc;
  }, {});

  const transformedData = Object.entries(aggregatedData)
    .map(([date, amount]) => ({
      date,
      amount,
      originalDate: new Date(date + "," + new Date().getFullYear()),
    }))
    .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime())
    .map(({ date, amount }) => ({
      date,
      amount,
    }));

  // Calculate total and growth
  const total = data.reduce((sum, invoice) => sum + invoice.total, 0);
  const currency = data[0]?.currency || "USD";

  // Calculate growth (comparing first and last week)
  const midPoint = Math.floor(transformedData.length / 2);
  const firstHalf = transformedData.slice(0, midPoint);
  const secondHalf = transformedData.slice(midPoint);

  const firstHalfTotal = firstHalf.reduce((sum, item) => sum + item.amount, 0);
  const secondHalfTotal = secondHalf.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const growth = firstHalfTotal
    ? ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100
    : 0;

  return {
    chartData: transformedData,
    total,
    growth,
    currency,
  };
};

const InvoiceGraph = async () => {
  const session = await reqUser();
  const { chartData, total, growth, currency } = await getInvoices(
    session.user?.id as string
  );

  return (
    <Card className="lg:col-span-2 transition-all duration-300 hover:shadow-md">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center">
                <TrendingUp className="size-4 text-primary" />
              </div>
              <CardTitle>Revenue Overview</CardTitle>
            </div>
            <CardDescription>Paid invoices in the last 30 days</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {formatCurrency({ amount: total, currency: currency as any })}
            </div>
            <div
              className={`text-sm flex items-center gap-1 ${
                growth >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {growth >= 0 ? "↑" : "↓"} {Math.abs(growth).toFixed(1)}% from
              previous period
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <Graph data={chartData} />
      </CardContent>
    </Card>
  );
};

export default InvoiceGraph;
