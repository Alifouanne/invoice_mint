import InvoiceList from "@/components/dashboard/InvoiceList";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FileText, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";

const InvoicesPage = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="size-5 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        </div>
        <p className="text-muted-foreground">
          Create, manage, and track all your invoices in one place
        </p>
      </div>

      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader className="border-b bg-muted/5">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold">
                All Invoices
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <ArrowUpDown className="size-4" />
                Sort by most recent
              </CardDescription>
            </div>
            <Link
              href="/dashboard/invoices/create"
              className={buttonVariants({
                className: "transition-all duration-300 hover:shadow-lg group",
              })}
            >
              <Plus className="size-4 mr-2 transition-transform duration-200 group-hover:rotate-90" />
              Create Invoice
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-b-lg bg-muted/5">
            <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
              <InvoiceList />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicesPage;
