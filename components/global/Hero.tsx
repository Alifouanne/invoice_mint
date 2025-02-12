import Link from "next/link";
import { RainbowButton } from "../ui/rainbow-button";
import Image from "next/image";
import HeroImage from "../../public/hero.png";

const Hero = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 lg:py-20 overflow-hidden">
      <div className="text-center z-10">
        <span className="inline-flex items-center text-sm font-medium tracking-tight bg-primary/10 text-primary px-4 py-2 rounded-full animate-fade-in">
          <span className="size-2 bg-primary rounded-full animate-pulse mr-2" />
          Introducing InvoiceMint 1.0
        </span>

        <h1 className="mt-8 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter animate-fade-in [text-wrap:balance]">
          Invoicing Made{" "}
          <span className="block mt-1 bg-gradient-to-r from-primary via-blue-500 to-teal-500 text-transparent bg-clip-text bg-[size:400%] animate-gradient">
            Super Easy!
          </span>
        </h1>

        <p className="max-w-xl mx-auto mt-6 text-base lg:text-lg text-muted-foreground animate-fade-in [text-wrap:balance]">
          Stop wrestling with complicated invoicing tools. With{" "}
          <span className="text-primary font-medium">InvoiceMint</span>, create
          professional invoices in minutes and get paid faster!
        </p>

        <div className="mt-8 mb-12 animate-fade-in">
          <Link href="/login">
            <RainbowButton className="font-medium text-base">
              Start Creating Invoices — It&apos;s Free
            </RainbowButton>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required • Free plan available
          </p>
        </div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto mt-8 px-4">
        {/* Background Gradient */}
        <div
          className="absolute inset-0 -mt-24 blur-3xl opacity-50"
          style={{
            background:
              "radial-gradient(circle at center, rgba(var(--primary-rgb), 0.15), transparent 70%)",
            zIndex: -1,
          }}
        />

        {/* Hero Image Container */}
        <div className="relative rounded-lg lg:rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-primary/25">
          <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent z-10" />
          <Image
            src={HeroImage || "/placeholder.svg"}
            alt="InvoiceMint Dashboard Preview"
            className="relative w-full h-auto object-cover transition-transform duration-700 hover:scale-[1.02]"
            priority
            quality={90}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
