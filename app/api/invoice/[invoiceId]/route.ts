/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/app/utils/db";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { jsPDF } from "jspdf";
import { NextResponse } from "next/server";

// Define colors
const COLORS = {
  primary: { r: 41, g: 98, b: 255 }, // #2962FF - Deep Blue
  secondary: { r: 45, g: 55, b: 72 }, // #2D3748 - Dark Gray
  accent: { r: 99, g: 102, b: 241 }, // #6366F1 - Indigo
  text: { r: 51, g: 51, b: 51 }, // #333333 - Dark Text
  lightGray: { r: 243, g: 244, b: 246 }, // #F3F4F6 - Light Gray
};

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  const { invoiceId } = await params;
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    select: {
      invoiceName: true,
      invoiceNumber: true,
      currency: true,
      fromAddress: true,
      fromEmail: true,
      fromName: true,
      clientAddress: true,
      clientEmail: true,
      clientName: true,
      date: true,
      dueDate: true,
      invoiceItemDescription: true,
      invoiceItemQuantity: true,
      invoiceItemRate: true,
      total: true,
      note: true,
    },
  });

  if (!data) {
    return NextResponse.json(
      {
        message: "invoice not found",
      },
      { status: 404 }
    );
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Helper function to draw rounded rectangle
  const roundedRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    pdf.roundedRect(x, y, w, h, r, r);
  };

  // Add background color to header
  pdf.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  pdf.rect(0, 0, 210, 40, "F");

  // Set white color for header text
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28);
  pdf.text(data.invoiceName, 20, 25);

  // Invoice number in header
  pdf.setFontSize(12);
  pdf.text(`#${data.invoiceNumber}`, 20, 35);

  // Reset text color for body
  pdf.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);

  // Add decorative element
  pdf.setDrawColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b);
  pdf.setLineWidth(0.5);
  pdf.line(20, 45, 190, 45);

  // From section with styled box
  pdf.setFillColor(COLORS.lightGray.r, COLORS.lightGray.g, COLORS.lightGray.b);
  roundedRect(15, 55, 80, 35, 3);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("From", 20, 65);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text([data.fromName, data.fromEmail, data.fromAddress], 20, 70);

  // Client section with styled box
  roundedRect(105, 55, 80, 35, 3);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Bill To", 110, 65);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text([data.clientName, data.clientEmail, data.clientAddress], 110, 70);

  // Date information with icons
  pdf.setDrawColor(COLORS.secondary.r, COLORS.secondary.g, COLORS.secondary.b);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Date Issued:", 20, 105);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(data.date),
    50,
    105
  );

  pdf.setFont("helvetica", "bold");
  pdf.text("Due Date:", 110, 105);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Due Date : Net ${data.dueDate}`, 140, 105);

  // Table header with background
  pdf.setFillColor(COLORS.secondary.r, COLORS.secondary.g, COLORS.secondary.b);
  pdf.rect(15, 115, 180, 10, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("Description", 20, 121);
  pdf.text("Quantity", 100, 121);
  pdf.text("Rate", 130, 121);
  pdf.text("Amount", 160, 121);

  // Table content
  pdf.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.invoiceItemDescription, 20, 135);
  pdf.text(data.invoiceItemQuantity.toString(), 100, 135);
  pdf.text(
    formatCurrency({
      amount: data.invoiceItemRate,
      currency: data.currency as any,
    }),
    130,
    135
  );
  pdf.text(
    formatCurrency({ amount: data.total, currency: data.currency as any }),
    160,
    135
  );

  // Total section with background
  pdf.setFillColor(COLORS.lightGray.r, COLORS.lightGray.g, COLORS.lightGray.b);
  roundedRect(120, 145, 75, 25, 3);
  pdf.setFont("helvetica", "bold");
  pdf.text(`Total ${data.currency}`, 125, 157);
  pdf.setFontSize(14);
  pdf.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  pdf.text(
    formatCurrency({ amount: data.total, currency: data.currency as any }),
    125,
    165
  );

  // Note section if exists
  if (data.note) {
    pdf.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("Note:", 20, 180);
    pdf.setFont("helvetica", "normal");
    pdf.text(data.note, 20, 187);
  }

  // Footer
  pdf.setDrawColor(COLORS.lightGray.r, COLORS.lightGray.g, COLORS.lightGray.b);
  pdf.setLineWidth(0.5);
  pdf.line(20, 270, 190, 270);
  pdf.setFontSize(8);
  pdf.setTextColor(COLORS.secondary.r, COLORS.secondary.g, COLORS.secondary.b);
  pdf.text("Thank you for your business", 20, 277);
  pdf.text(new Date().getFullYear().toString(), 180, 277);

  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
