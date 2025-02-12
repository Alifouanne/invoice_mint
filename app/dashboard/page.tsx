import React, { Suspense } from "react";
import { reqUser } from "../utils/hooks";
import DashboardBloks from "@/components/dashboard/DashboardBloks";
import InvoiceGraph from "@/components/dashboard/InvoiceGraph";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import { prisma } from "../utils/db";
import EmptyState from "@/components/dashboard/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

const getData = async (userId: string) => {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
    },
  });
  return data;
};
const DashboardPage = async () => {
  const session = await reqUser();
  const data = await getData(session.user?.id as string);
  return (
    <>
      {data.length < 1 ? (
        <EmptyState
          title="No invoices found"
          description="Create an invoice to see it right here"
          buttonText="Create Invoice"
          href="/dashboard/invoices/create"
        />
      ) : (
        <Suspense fallback={<Skeleton className="w-full h-full flex-1" />}>
          <DashboardBloks />
          <div className="grid gap-4 lg:grid-cols-3 md:gap-8">
            <InvoiceGraph />
            <RecentInvoices />
          </div>
        </Suspense>
      )}
    </>
  );
};

export default DashboardPage;
