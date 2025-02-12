/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import InvoiceActions from "./InvoiceActions";
import { prisma } from "@/app/utils/db";
import { reqUser } from "@/app/utils/hooks";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

const getData = async (userId: string) => {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      clientName: true,
      total: true,
      createdAt: true,
      status: true,
      invoiceNumber: true,
      currency: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
};

const StatusBadgeMap = {
  PAID: "bg-green-100 text-green-800 hover:bg-green-200",
  PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
} as const;

const InvoiceList = async () => {
  const session = await reqUser();
  const data = await getData(session.user?.id as string);

  if (!data.length) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 animate-fade-in">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg
            className="size-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-1">No invoices yet</h3>
        <p className="text-muted-foreground text-sm max-w-sm mb-4">
          Create your first invoice to get started. It only takes a few minutes.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/50 bg-muted/5">
            <TableHead className="w-[100px]">Invoice ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((invoice) => (
            <TableRow
              key={invoice.id}
              className="group hover:bg-muted/50 transition-colors duration-200"
            >
              <TableCell className="font-medium">
                #{invoice.invoiceNumber}
              </TableCell>
              <TableCell className="font-medium">
                {invoice.clientName}
              </TableCell>
              <TableCell className="tabular-nums">
                {formatCurrency({
                  amount: invoice.total,
                  currency: invoice.currency as any,
                })}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={`${
                    StatusBadgeMap[
                      invoice.status as keyof typeof StatusBadgeMap
                    ]
                  } transition-colors duration-200`}
                >
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                }).format(invoice.createdAt)}
              </TableCell>
              <TableCell className="text-right opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <InvoiceActions id={invoice.id} status={invoice.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Loading state component
export function InvoiceListSkeleton() {
  return (
    <div className="rounded-md border animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/50 bg-muted/5">
            <TableHead className="w-[100px]">Invoice ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-20 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default InvoiceList;
