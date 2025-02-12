"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  CheckCircle,
  DownloadCloud,
  Mail,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { toast } from "sonner";

interface Props {
  id: string;
  status: string;
}
const InvoiceActions = ({ id, status }: Props) => {
  const handleSendReminder = () => {
    toast.promise(
      fetch(`/api/email/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      {
        loading: "Sending reminder email...",
        success: "Reminder email sent successfully",
        error: "Failed to send reminder email",
      }
    );
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-primary/10 transition-colors duration-200"
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open invoice actions menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" sideOffset={5}>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Invoice Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Primary Actions */}
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/invoices/${id}`}
                  className="flex items-center cursor-pointer transition-colors duration-200"
                >
                  <Pencil className="size-4 mr-2 text-primary" />
                  Edit Invoice
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/api/invoice/${id}`}
                  className="flex items-center cursor-pointer transition-colors duration-200"
                  target="_blank"
                >
                  <DownloadCloud className="size-4 mr-2 text-primary" />
                  Download PDF
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Status Actions */}
              {status !== "PAID" && (
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/invoices/${id}/paid`}
                    className="flex items-center cursor-pointer transition-colors duration-200"
                  >
                    <CheckCircle className="size-4 mr-2 text-green-600" />
                    Mark as Paid
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleSendReminder}
                className="flex items-center cursor-pointer transition-colors duration-200 w-full justify-start hover:no-underline"
              >
                <Mail className="size-4 mr-2 text-blue-600" />
                Send Reminder
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Destructive Action */}
              <DropdownMenuItem asChild className="group">
                <Link
                  href={`/dashboard/invoices/${id}/delete`}
                  className="flex items-center cursor-pointer text-destructive hover:text-destructive transition-colors duration-200"
                >
                  <Trash className="size-4 mr-2" />
                  Delete Invoice
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={5}>
          <p>Invoice Actions</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InvoiceActions;
