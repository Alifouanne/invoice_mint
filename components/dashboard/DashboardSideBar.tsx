import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "@/public/dark-logo.svg";
import DashboardLinks from "./DashboardLinks";

const DashboardSideBar = () => {
  return (
    <div className="hidden border-r bg-gradient-to-b from-background to-muted/40 md:block transition-transform duration-300 ease-in-out">
      <div className="flex flex-col max-h-screen h-full">
        {/* Header Section */}
        <div className="h-14 flex items-center border-b px-4 lg:h-[60px] lg:px-6 bg-background/50 backdrop-blur-sm animate-fade-in">
          <Link
            href="/"
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-[0.98] active:scale-[0.97]"
          >
            <div className="relative animate-bounce-subtle">
              <Image
                src={Logo}
                alt="InvoiceMint Logo"
                className="size-7 transition-transform duration-300 hover:rotate-[-8deg]"
                priority
              />
              <div className="absolute inset-0 size-7 bg-primary/10 rounded-full animate-ping opacity-20" />
            </div>
            <p className="text-2xl font-bold tracking-tight">
              Invoice<span className="text-cyan-600">Mint</span>
            </p>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4 gap-1">
            <DashboardLinks />
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t bg-background/50 backdrop-blur-sm p-4 hidden lg:block">
          <div className="text-xs text-muted-foreground text-center">
            InvoiceMint © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSideBar;
