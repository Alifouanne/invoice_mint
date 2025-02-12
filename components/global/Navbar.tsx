import Link from "next/link";
import Logo from "../../public/light-logo.svg";
import Image from "next/image";
import { ShimmerButton } from "../ui/shimmer-button";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <nav className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform duration-300 hover:scale-[0.98] group"
        >
          <div className="relative">
            <Image
              src={Logo || "/placeholder.svg"}
              alt="InvoiceMint Logo"
              className="size-9 transition-transform duration-300 group-hover:rotate-[-8deg]"
              priority
            />
            <div className="absolute inset-0 size-9 bg-primary/10 rounded-full animate-ping-slow opacity-0 group-hover:opacity-75" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">
            Invoice
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent ml-1">
              Mint
            </span>
          </h3>
        </Link>

        <Link href="/login">
          <ShimmerButton className="font-medium transition-transform duration-300 hover:scale-[0.98]">
            Get Started Free
          </ShimmerButton>
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
