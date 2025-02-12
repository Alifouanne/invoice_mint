/* eslint-disable @typescript-eslint/no-explicit-any */
// import { MarkAsPaid } from "@/app/utils/actions";
// import { prisma } from "@/app/utils/db";
// import { reqUser } from "@/app/utils/hooks";
// import { SubmitButton } from "@/components/global/SubmitButtons";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { MailCheck } from "lucide-react";
// import Link from "next/link";
// import { redirect } from "next/navigation";
// import React from "react";

// const Authorize = async (invoiceId: string, userId: string) => {
//   const data = await prisma.invoice.findUnique({
//     where: {
//       id: invoiceId,
//       userId: userId,
//     },
//   });
//   if (!data) {
//     return redirect("/dashboard/invoices");
//   }
// };
// const PaidPage = async ({
//   params,
// }: {
//   params: Promise<{ invoiceId: string }>;
// }) => {
//   const { invoiceId } = await params;
//   const session = await reqUser();
//   await Authorize(invoiceId, session.user?.id as string);
//   return (
//     <div className="flex flex-1 justify-center items-center">
//       <Card className="max-w-[500px]">
//         <CardHeader>
//           <CardTitle>Mark as Paid</CardTitle>
//           <CardDescription>
//             Are you sure you want to mark this invoice as paid?
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <MailCheck className="size-10 p-2 text-green-500 bg-green-500/20 rounded-full" />
//         </CardContent>
//         <CardFooter className="flex items-center justify-between">
//           <Button variant="outline">
//             <Link href="/dashboard/invoices">Cancel</Link>
//           </Button>
//           <form
//             action={async () => {
//               "use server";
//               await MarkAsPaid(invoiceId);
//             }}
//           >
//             <SubmitButton text="Mark as Paid" />
//           </form>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// };

// export default PaidPage;
import { MarkAsPaid } from "@/app/utils/actions";
import { prisma } from "@/app/utils/db";
import { reqUser } from "@/app/utils/hooks";
import { SubmitButton } from "@/components/global/SubmitButtons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, DollarSign } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { formatCurrency } from "@/app/utils/formatCurrency";

const Authorize = async (invoiceId: string, userId: string) => {
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
      userId: userId,
    },
    select: {
      id: true,
      invoiceNumber: true,
      clientName: true,
      total: true,
      currency: true,
      createdAt: true,
    },
  });
  if (!data) {
    return redirect("/dashboard/invoices");
  }
  return data;
};

const PaidPage = async ({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) => {
  const { invoiceId } = await params;
  const session = await reqUser();
  const invoice = await Authorize(invoiceId, session.user?.id as string);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md transform transition-all duration-200 hover:shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto size-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <DollarSign className="size-6 text-primary animate-bounce-subtle" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Mark Invoice as Paid
          </CardTitle>
          <CardDescription className="text-base">
            Confirm payment received for invoice #{invoice.invoiceNumber}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Invoice Summary */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-sm text-muted-foreground">
                Invoice Details
              </span>
              <span className="text-sm font-medium">
                #{invoice.invoiceNumber}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Client</span>
                <span className="font-medium">{invoice.clientName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">
                  {formatCurrency({
                    amount: invoice.total,
                    currency: invoice.currency as any,
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Issue Date</span>
                <span className="font-medium">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                  }).format(invoice.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Confirmation Message */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-5 text-primary shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-primary">Payment Confirmation</p>
                <p className="text-muted-foreground mt-1">
                  By marking this invoice as paid, you confirm that you&apos;ve
                  received the full payment amount. This action will update the
                  invoice status and notify the client.
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-4 pt-6">
          <Button asChild variant="ghost" className="flex-1 group">
            <Link href="/dashboard/invoices">
              <ArrowLeft className="size-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
              Cancel
            </Link>
          </Button>
          <form
            action={async () => {
              "use server";
              await MarkAsPaid(invoiceId);
            }}
            className="flex-1"
          >
            <SubmitButton text="Confirm Payment" variant="default" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaidPage;
