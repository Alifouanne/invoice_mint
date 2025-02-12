import { DeleteInvoice } from "@/app/utils/actions";
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
import { Input } from "@/components/ui/input";
import { AlertTriangle, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const Authorize = async (id: string, userId: string) => {
  const data = await prisma.invoice.findUnique({
    where: {
      id: id,
      userId: userId,
    },
  });

  if (!data) {
    return redirect("/dashboard/invoices");
  }
  return data;
};

const DeletePage = async ({
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
          <div className="mx-auto size-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <Trash2 className="size-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">
            Delete Invoice
          </CardTitle>
          <CardDescription className="text-base">
            Are you sure you want to delete invoice #{invoice.invoiceNumber}?
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="size-5 text-destructive shrink-0" />
              <div className="text-sm text-destructive">
                <p className="font-medium">
                  Warning: This action cannot be undone
                </p>
                <p className="text-destructive/80 mt-1">
                  Once you delete this invoice, you will not be able to recover
                  it. All associated data will be permanently removed.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Client:</span>
              <span className="font-medium">{invoice.clientName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{invoice.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                }).format(invoice.createdAt)}
              </span>
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
              await DeleteInvoice(invoiceId);
            }}
            className="flex-1"
          >
            <Input type="hidden" name="invoiceId" value={invoiceId} />
            <SubmitButton text="Delete Invoice" variant="destructive" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeletePage;
