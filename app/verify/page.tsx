import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";

const VerifyPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white to-gray-50/50 p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      </div>
      <Card className="w-[400px] px-6 transform transition-all duration-300 ease-in-out hover:shadow-lg">
        <CardHeader className="text-center space-y-3">
          <div className="relative">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4 transition-transform duration-300 ease-in-out hover:scale-105">
              <Mail className="size-10 text-primary animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 size-20 mx-auto animate-ping opacity-20" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Verify your email address
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            We&apos;ve sent a verification link to your email address. Please
            click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4 rounded-lg bg-yellow-50 border border-yellow-100 p-4 transition-all duration-300 ease-in-out hover:bg-yellow-100">
            <div className="flex items-center gap-3">
              <AlertCircle className="size-5 text-yellow-600 shrink-0" />
              <p className="text-sm text-yellow-700">
                Can&apos;t find the email? Check your spam folder or click the
                button below to return home and try again.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pb-6">
          <Button
            className="w-full group transition-all duration-300 hover:shadow-md"
            variant="outline"
            asChild
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Return to homepage
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyPage;
