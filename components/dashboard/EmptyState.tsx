import { PlusCircle } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description: string;
  buttonText: string;
  href: string;
  icon?: React.ReactNode;
  className?: string;
}

const EmptyState = ({
  buttonText,
  description,
  href,
  title,
  icon,
  className,
}: Props) => {
  return (
    <div
      className={cn(
        "relative flex flex-col flex-1 h-full items-center justify-center rounded-lg border-2 border-dashed p-8 text-center",
        "before:absolute before:inset-0 before:bg-gradient-to-b before:from-background before:to-muted/50 before:rounded-lg before:-z-10",
        "animate-in fade-in-50 duration-500 ease-out",
        className
      )}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="flex items-center justify-center size-20 rounded-full bg-primary/10 transition-transform duration-500 hover:scale-105">
            {icon || (
              <PlusCircle className="size-10 text-primary animate-pulse" />
            )}
          </div>
          <div className="absolute inset-0 size-20 rounded-full bg-primary/5 animate-ping opacity-75" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {description}
          </p>
        </div>

        <Link
          href={href}
          className={cn(
            buttonVariants(),
            "transition-all duration-300 hover:shadow-md group"
          )}
        >
          <PlusCircle className="size-4 mr-2 transition-transform duration-200 group-hover:rotate-90" />
          {buttonText}
        </Link>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 -z-20 overflow-hidden rounded-lg">
        <div className="absolute size-[500px] opacity-50 -top-32 -right-32 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute size-[500px] opacity-50 -bottom-32 -left-32 rounded-full bg-primary/5 blur-3xl" />
      </div>
    </div>
  );
};

export default EmptyState;
