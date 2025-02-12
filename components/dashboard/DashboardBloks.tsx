import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
import { prisma } from "@/app/utils/db";
import { reqUser } from "@/app/utils/hooks";
import { formatCurrency } from "@/app/utils/formatCurrency";

const getData = async (userId: string) => {
  const [data, openInvoices, paidInvoices] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        userId: userId,
      },
      select: {
        total: true,
        currency: true,
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: "PENDING",
      },
      select: {
        id: true,
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: "PAID",
      },
      select: {
        id: true,
      },
    }),
  ]);
  return { data, openInvoices, paidInvoices };
};

const DashboardBlocks = async () => {
  const session = await reqUser();
  const { data, openInvoices, paidInvoices } = await getData(
    session.user?.id as string
  );

  const totalRevenue = data.reduce((acc, invoice) => acc + invoice.total, 0);
  const currency = (data[0]?.currency || "USD") as "USD" | "EUR";

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency({ amount: totalRevenue, currency }),
      description: "+20.1% from last month",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Total Invoices",
      value: data.length,
      description: `${data.length} invoices issued`,
      icon: Users,
      trend: "neutral",
    },
    {
      title: "Paid Invoices",
      value: paidInvoices.length,
      description: `${((paidInvoices.length / data.length) * 100).toFixed(
        1
      )}% success rate`,
      icon: CreditCard,
      trend: "up",
    },
    {
      title: "Open Invoices",
      value: openInvoices.length,
      description: `${openInvoices.length} pending payments`,
      icon: Activity,
      trend: "down",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="transition-all duration-300 hover:shadow-md group"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className="rounded-full bg-primary/10 p-2 transition-colors duration-300 group-hover:bg-primary/20">
              <stat.icon className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-tight">
                {stat.value}
              </h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {stat.trend === "up" && (
                  <ArrowUp className="size-3 text-green-500" />
                )}
                {stat.trend === "down" && (
                  <ArrowDown className="size-3 text-red-500" />
                )}
                {stat.description}
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mt-3 h-1 w-full bg-muted overflow-hidden rounded-full">
              <div
                className={`h-full transition-all duration-500 ease-in-out rounded-full ${
                  stat.trend === "up"
                    ? "bg-green-500"
                    : stat.trend === "down"
                    ? "bg-red-500"
                    : "bg-primary"
                }`}
                style={{
                  width:
                    stat.trend === "neutral"
                      ? "75%"
                      : stat.trend === "up"
                      ? "85%"
                      : "45%",
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardBlocks;
