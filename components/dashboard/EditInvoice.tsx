/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CalendarIcon, FileText, Receipt } from "lucide-react";
import React, { useActionState, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";
import { SubmitButton } from "../global/SubmitButtons";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema } from "@/app/utils/zodSchemas";
import { editInvoice } from "@/app/utils/actions";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { Prisma } from "@prisma/client";

interface Props {
  data: Prisma.InvoiceGetPayload<{}>;
}
const EditInvoice = ({ data }: Props) => {
  const [lastResult, action] = useActionState(editInvoice, undefined);
  const [form, fields] = useForm({
    lastResult: lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: invoiceSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  const [selectedDate, setSelectedDate] = useState(data.date);
  const [rate, setRate] = useState(data.invoiceItemRate.toString());
  const [quantity, setQuantity] = useState(data.invoiceItemQuantity.toString());
  const [currency, setCurrency] = useState(data.currency);
  const calculateTotal = (Number(quantity) || 0) * (Number(rate) || 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Receipt className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Invoice</h1>
          <p className="text-muted-foreground">Edit invoice for your client</p>
        </div>
      </div>

      <Card className="transition-all duration-300 hover:shadow-md">
        <CardContent className="p-6">
          <form
            id={form.id}
            action={action}
            onSubmit={form.onSubmit}
            noValidate
            className="space-y-8"
          >
            <Input
              type="hidden"
              name={fields.date.name}
              value={selectedDate.toISOString()}
            />
            <Input type="hidden" name="id" value={data.id} />
            <Input
              type="hidden"
              name={fields.total.name}
              value={calculateTotal}
            />

            {/* Invoice Header */}
            <div className="flex flex-col gap-2 w-fit">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="animate-pulse">
                  Draft
                </Badge>
                <Input
                  placeholder="Invoice Title..."
                  name={fields.invoiceName.name}
                  key={fields.invoiceName.key}
                  defaultValue={data.invoiceName}
                  className="min-w-[300px] transition-all duration-200 hover:border-primary focus:border-primary"
                />
              </div>
              {fields.invoiceName.errors && (
                <p className="text-sm text-destructive animate-fade-in">
                  {fields.invoiceName.errors}
                </p>
              )}
            </div>

            {/* Invoice Details */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Invoice No.</Label>
                <div className="flex">
                  <span className="px-3 border border-r-0 rounded-l-md bg-muted flex items-center text-muted-foreground">
                    #
                  </span>
                  <Input
                    placeholder="INV-001"
                    className="rounded-l-none transition-all duration-200 hover:border-primary focus:border-primary"
                    name={fields.invoiceNumber.name}
                    key={fields.invoiceNumber.key}
                    defaultValue={data.invoiceNumber}
                  />
                </div>
                {fields.invoiceNumber.errors && (
                  <p className="text-sm text-destructive animate-fade-in">
                    {fields.invoiceNumber.errors}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  defaultValue="USD"
                  name={fields.currency.name}
                  key={fields.currency.key}
                  onValueChange={setCurrency}
                >
                  <SelectTrigger className="transition-all duration-200 hover:border-primary focus:border-primary">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">
                      United States Dollar (USD)
                    </SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
                {fields.currency.errors && (
                  <p className="text-sm text-destructive animate-fade-in">
                    {fields.currency.errors}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* From/To Section */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* From Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-muted-foreground" />
                  <Label className="text-lg font-medium">From</Label>
                </div>
                <div className="space-y-3">
                  <div>
                    <Input
                      placeholder="Your Name"
                      name={fields.fromName.name}
                      key={fields.fromName.key}
                      defaultValue={data.fromName}
                      className="transition-all duration-200 hover:border-primary focus:border-primary"
                    />
                    {fields.fromName.errors && (
                      <p className="text-sm text-destructive mt-1 animate-fade-in">
                        {fields.fromName.errors}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="your.email@example.com"
                      name={fields.fromEmail.name}
                      key={fields.fromEmail.key}
                      defaultValue={data.fromEmail}
                      className="transition-all duration-200 hover:border-primary focus:border-primary"
                    />
                    {fields.fromEmail.errors && (
                      <p className="text-sm text-destructive mt-1 animate-fade-in">
                        {fields.fromEmail.errors}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="Your Address"
                      name={fields.fromAddress.name}
                      key={fields.fromAddress.key}
                      defaultValue={data.fromAddress}
                      className="transition-all duration-200 hover:border-primary focus:border-primary"
                    />
                    {fields.fromAddress.errors && (
                      <p className="text-sm text-destructive mt-1 animate-fade-in">
                        {fields.fromAddress.errors}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* To Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-muted-foreground" />
                  <Label className="text-lg font-medium">Bill To</Label>
                </div>
                <div className="space-y-3">
                  <div>
                    <Input
                      placeholder="Client Name"
                      name={fields.clientName.name}
                      key={fields.clientName.key}
                      defaultValue={data.clientName}
                      className="transition-all duration-200 hover:border-primary focus:border-primary"
                    />
                    {fields.clientName.errors && (
                      <p className="text-sm text-destructive mt-1 animate-fade-in">
                        {fields.clientName.errors}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="client.email@example.com"
                      name={fields.clientEmail.name}
                      key={fields.clientEmail.key}
                      defaultValue={data.clientEmail}
                      className="transition-all duration-200 hover:border-primary focus:border-primary"
                    />
                    {fields.clientEmail.errors && (
                      <p className="text-sm text-destructive mt-1 animate-fade-in">
                        {fields.clientEmail.errors}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="Client Address"
                      name={fields.clientAddress.name}
                      key={fields.clientAddress.key}
                      defaultValue={data.clientAddress}
                      className="transition-all duration-200 hover:border-primary focus:border-primary"
                    />
                    {fields.clientAddress.errors && (
                      <p className="text-sm text-destructive mt-1 animate-fade-in">
                        {fields.clientAddress.errors}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Dates Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Issue Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full text-left justify-start transition-all duration-200 hover:border-primary"
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {selectedDate ? (
                        new Intl.DateTimeFormat("en-US", {
                          dateStyle: "long",
                        }).format(selectedDate)
                      ) : (
                        <span>Pick a Date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => setSelectedDate(date || new Date())}
                      fromDate={new Date()}
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
                {fields.date.errors && (
                  <p className="text-sm text-destructive animate-fade-in">
                    {fields.date.errors}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Payment Terms</Label>
                <Select
                  name={fields.dueDate.name}
                  key={fields.dueDate.key}
                  defaultValue={data.dueDate.toString()}
                >
                  <SelectTrigger className="transition-all duration-200 hover:border-primary focus:border-primary">
                    <SelectValue placeholder="Select Payment Terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Due on Receipt</SelectItem>
                    <SelectItem value="15">Net 15</SelectItem>
                    <SelectItem value="30">Net 30</SelectItem>
                  </SelectContent>
                </Select>
                {fields.dueDate.errors && (
                  <p className="text-sm text-destructive animate-fade-in">
                    {fields.dueDate.errors}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Items Section */}
            <div className="space-y-4">
              <Label className="text-lg font-medium">Invoice Items</Label>
              <div className="grid grid-cols-12 gap-4 mb-2 text-sm font-medium text-muted-foreground">
                <p className="col-span-6">Description</p>
                <p className="col-span-2">Quantity</p>
                <p className="col-span-2">Rate</p>
                <p className="col-span-2">Amount</p>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <Textarea
                    placeholder="Item description..."
                    name={fields.invoiceItemDescription.name}
                    key={fields.invoiceItemDescription.key}
                    defaultValue={data.invoiceItemDescription}
                    className="resize-none transition-all duration-200 hover:border-primary focus:border-primary"
                  />
                  {fields.invoiceItemDescription.errors && (
                    <p className="text-sm text-destructive mt-1 animate-fade-in">
                      {fields.invoiceItemDescription.errors}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    placeholder="0"
                    type="number"
                    name={fields.invoiceItemQuantity.name}
                    key={fields.invoiceItemQuantity.key}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="transition-all duration-200 hover:border-primary focus:border-primary"
                  />
                  {fields.invoiceItemQuantity.errors && (
                    <p className="text-sm text-destructive mt-1 animate-fade-in">
                      {fields.invoiceItemQuantity.errors}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    placeholder="0"
                    type="number"
                    name={fields.invoiceItemRate.name}
                    key={fields.invoiceItemRate.key}
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="transition-all duration-200 hover:border-primary focus:border-primary"
                  />
                  {fields.invoiceItemRate.errors && (
                    <p className="text-sm text-destructive mt-1 animate-fade-in">
                      {fields.invoiceItemRate.errors}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    disabled
                    value={formatCurrency({
                      amount: calculateTotal,
                      currency: currency as any,
                    })}
                    className="bg-muted/50"
                  />
                </div>
              </div>
            </div>

            {/* Totals Section */}
            <div className="flex justify-end">
              <div className="w-1/3 space-y-2">
                <div className="flex justify-between py-2 text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency({
                      amount: calculateTotal,
                      currency: currency as any,
                    })}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between py-2">
                  <span className="font-medium">Total ({currency})</span>
                  <span className="font-bold text-lg">
                    {formatCurrency({
                      amount: calculateTotal,
                      currency: currency as any,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea
                placeholder="Add any additional notes or payment instructions..."
                name={fields.note.name}
                key={fields.note.key}
                defaultValue={data.note ?? undefined}
                className="min-h-[100px] transition-all duration-200 hover:border-primary focus:border-primary"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end pt-4">
              <div className="space-x-2">
                <SubmitButton text="Update Invoice" />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditInvoice;
