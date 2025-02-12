import React from "react";
import Link from "next/link";
import DashboardLinks from "@/components/dashboard/DashboardLinks";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dashboardLinks } from "@/app/utils/constants";
import { auth, signOut } from "@/app/utils/auth";

const DashboardNav = async () => {
  const session = await auth();
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-gradient-to-r from-background via-muted/40 to-background px-4 lg:h-[60px] lg:px-6 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-primary/10 transition-colors duration-200"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[300px] sm:w-[400px] bg-gradient-to-b from-background to-muted/50"
        >
          <SheetHeader>
            <SheetTitle className="text-xl font-bold">
              InvoiceMint Dashboard
            </SheetTitle>
            <SheetDescription>
              Access all your invoicing tools and settings
            </SheetDescription>
          </SheetHeader>
          <nav className="grid gap-2 mt-10">
            <DashboardLinks />
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2 ml-auto">
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="rounded-full hover:bg-primary/10 transition-colors duration-200"
              variant="ghost"
              size="icon"
            >
              <User2 className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Your Account</p>
                <p className="text-xs text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {dashboardLinks.map((link) => (
              <DropdownMenuItem
                asChild
                key={link.id}
                className="hover:bg-primary/10 cursor-pointer"
              >
                <Link href={link.href} className="w-full">
                  {link.name}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form
                className="w-full"
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button
                  className="w-full text-left font-normal hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                  variant="ghost"
                >
                  Sign out
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardNav;
