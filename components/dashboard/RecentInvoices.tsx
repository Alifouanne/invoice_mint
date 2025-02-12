/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { prisma } from "@/app/utils/db";
import { reqUser } from "@/app/utils/hooks";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { Clock, Receipt } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

const getDate = async (userId: string) => {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      clientName: true,
      clientEmail: true,
      total: true,
      currency: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 7,
  });
  return data;
};

const RecentInvoices = async () => {
  const session = await reqUser();
  const data = await getDate(session.user?.id as string);

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          <CardTitle className="text-base font-medium">
            Recent Invoices
          </CardTitle>
        </div>
        <span className="text-sm text-muted-foreground">Last 7 invoices</span>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Receipt className="size-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No recent invoices</h3>
            <p className="text-sm text-muted-foreground max-w-[180px]">
              When you create invoices, they&apos;ll appear here
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {data.map((item) => (
                <div
                  className="flex items-center gap-4 p-2 rounded-lg transition-colors duration-200 hover:bg-muted/50 group"
                  key={item.id}
                >
                  <Avatar className="hidden sm:flex size-9 border-2 border-transparent group-hover:border-primary transition-colors duration-200">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {item.clientName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none truncate">
                        {item.clientName}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                        }).format(new Date(item.createdAt))}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {item.clientEmail}
                    </p>
                  </div>
                  <div className="font-medium tabular-nums text-sm group-hover:text-primary transition-colors duration-200">
                    +
                    {formatCurrency({
                      amount: item.total,
                      currency: item.currency as any,
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

// Loading state component
export function RecentInvoicesSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div className="flex items-center gap-4" key={i}>
              <Skeleton className="size-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentInvoices;
