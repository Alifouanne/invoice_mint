import { z } from "zod";
export const onboardingSchema = z.object({
  firstName: z.string().min(3, "First Name is required"),
  lastName: z.string().min(3, "Last Name is required"),
  address: z.string().min(3, "Address is required"),
});

export const invoiceSchema = z.object({
  invoiceName: z.string().min(1, "Invoice Name is Required"),
  total: z.number().min(1, "1$ is minimum"),
  status: z.enum(["PAID", "PENDING"]).default("PENDING"),
  date: z.string().min(1, "Date is Required"),
  dueDate: z.number().min(0, "Due Date is Required"),
  fromName: z.string().min(1, "Your Name is Required"),
  fromEmail: z.string().email("Invalid Email Address"),
  fromAddress: z.string().min(1, "Your Address is Required"),
  clientName: z.string().min(1, "Client Name is Required"),
  clientEmail: z.string().email("Invalid Email Address"),
  clientAddress: z.string().min(1, "Client Address is Required"),
  currency: z.string().min(1, "Currency is Required"),
  invoiceNumber: z.number().min(1, "Minimum Invoice Number is 1"),
  note: z.string().optional(),

  invoiceItemDescription: z.string().min(1, "Description is Required"),
  invoiceItemQuantity: z.number().min(1, "Quantity Minimum 1"),
  invoiceItemRate: z.number().min(1, "Rate Minimum 1"),
});
