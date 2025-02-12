/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { formatCurrency } from "./formatCurrency";
import { reqUser } from "./hooks";
import { emailClient } from "./mailtrap";
import { invoiceSchema, onboardingSchema } from "./zodSchemas";
export async function onboardUser(prevState: unknown, formdata: FormData) {
  const session = await reqUser();
  const submission = parseWithZod(formdata, { schema: onboardingSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }
  await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      address: submission.value.address,
    },
  });
  return redirect("/dashboard");
}

export async function createInvoice(prevState: unknown, formdata: FormData) {
  const session = await reqUser();
  const submission = parseWithZod(formdata, { schema: invoiceSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }
  const data = await prisma.invoice.create({
    data: {
      clientAddress: submission.value.clientAddress,
      clientEmail: submission.value.clientEmail,
      clientName: submission.value.clientName,
      currency: submission.value.currency,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromAddress: submission.value.fromAddress,
      fromName: submission.value.fromName,
      fromEmail: submission.value.fromEmail,
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,
      status: submission.value.status,
      total: submission.value.total,
      note: submission.value.note,
      userId: session.user?.id,
    },
  });
  const sender = {
    email: "hello@demomailtrap.com",

    name: "Ali Fouanne",
  };
  emailClient.send({
    from: sender,
    to: [{ email: "alifouanne7@gmail.com" }],
    template_uuid: "f0b8da02-3066-4492-91c3-2f77a8b2bb30",

    template_variables: {
      clientName: submission.value.clientName,

      invoiceNumber: submission.value.invoiceNumber,

      dueDate: new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(
        submission.value.dueDate
      ),

      totalAmount: formatCurrency({
        amount: submission.value.total,
        currency: submission.value.currency as any,
      }),

      invoiceLink:
        process.env.NODE_ENV !== "production"
          ? `http://localhost:3000/api/invoice/${data.id}`
          : `https://invoice-mint.vercel.app/api/invoice/${data.id}`,
    },
  });
  return redirect("/dashboard/invoices");
}

export async function editInvoice(prevState: unknown, formdata: FormData) {
  const session = await reqUser();
  const submission = parseWithZod(formdata, { schema: invoiceSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }
  const data = await prisma.invoice.update({
    where: {
      userId: session.user?.id,
      id: formdata.get("id") as string,
    },
    data: {
      clientAddress: submission.value.clientAddress,
      clientEmail: submission.value.clientEmail,
      clientName: submission.value.clientName,
      currency: submission.value.currency,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromAddress: submission.value.fromAddress,
      fromName: submission.value.fromName,
      fromEmail: submission.value.fromEmail,
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,
      status: submission.value.status,
      total: submission.value.total,
      note: submission.value.note,
    },
  });
  const sender = {
    email: "hello@demomailtrap.com",

    name: "Ali Fouanne",
  };
  emailClient.send({
    from: sender,
    to: [{ email: "alifouanne7@gmail.com" }],
    template_uuid: "5e6cb0ff-f71d-45c4-98a2-5410ab134358",

    template_variables: {
      clientName: submission.value.clientName,

      invoiceNumber: submission.value.invoiceNumber,

      dueDate: new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(
        submission.value.dueDate
      ),

      totalAmount: formatCurrency({
        amount: submission.value.total,
        currency: submission.value.currency as any,
      }),

      invoiceLink: `http://localhost:3000/api/invoice/${data.id}`,
    },
  });
  return redirect("/dashboard/invoices");
}

export async function DeleteInvoice(invoiceId: string) {
  const session = await reqUser();
  const data = await prisma.invoice.delete({
    where: {
      id: invoiceId,
      userId: session.user?.id,
    },
  });
  return redirect("/dashboard/invoices");
}

export async function MarkAsPaid(invoiceId: string) {
  const session = await reqUser();
  const data = await prisma.invoice.update({
    where: {
      userId: session.user?.id,
      id: invoiceId,
    },
    data: {
      status: "PAID",
    },
  });
  return redirect("/dashboard/invoices");
}
