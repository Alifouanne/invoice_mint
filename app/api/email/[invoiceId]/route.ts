/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/app/utils/db";
import { reqUser } from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  try {
    const session = await reqUser();

    const { invoiceId } = await params;

    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
    });

    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const sender = {
      email: "hello@demomailtrap.com",

      name: "Ali Fouanne",
    };

    emailClient.send({
      from: sender,
      to: [{ email: "alifouanne7@gmail.com" }],
      template_uuid: "b7366d92-1596-41c0-a6f9-e79e1da53292",
      template_variables: {
        company_info_name: "Invoice Mint",
        first_name: invoiceData.clientName,
        company_info_address: "Al Buteen 1",
        company_info_city: "Abu Dhabi",
        company_info_zip_code: "00000",
        company_info_country: "UAE",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send Email reminder" },
      { status: 500 }
    );
  }
}

// const sender = {
//   email: "hello@demomailtrap.com",

//   name: "Ali Fouanne",
// };
// emailClient.send({
//   from: sender,
//   to: [{ email: "alifouanne7@gmail.com" }],
//   subject: "Reminder Invoice Payment",
//   text: "Hey you forget to pay the invoice",

// });
