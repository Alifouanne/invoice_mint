import { prisma } from "@/app/utils/db";
import { reqUser } from "@/app/utils/hooks";
import EditInvoice from "@/components/dashboard/EditInvoice";
import { notFound } from "next/navigation";
import React from "react";

async function getData(invoiceId: string, userId: string) {
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
      userId: userId,
    },
  });
  if (!data) {
    return notFound();
  }
  return data;
}
const EditInvoicePage = async ({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) => {
  const user = await reqUser();
  const { invoiceId } = await params;
  const data = await getData(invoiceId, user.user?.id as string);
  return <EditInvoice data={data} />;
};

export default EditInvoicePage;
