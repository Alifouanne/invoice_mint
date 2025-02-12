"use client";

import { SubmitButton } from "@/components/global/SubmitButtons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, MapPin, User2 } from "lucide-react";
import React, { useActionState } from "react";
import { onboardUser } from "../utils/actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchema } from "../utils/zodSchemas";

const OnBoardingPage = () => {
  const [lastresult, action] = useActionState(onboardUser, undefined);
  const [form, fields] = useForm({
    lastResult: lastresult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: onboardingSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/50">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-primary">
            <CheckCircle2 className="size-8 animate-bounce-subtle" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight animate-fade-in">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Just a few more details to personalize your experience
          </p>
        </div>
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
        </div>

        <Card className="border-muted/50 shadow-lg transition-all duration-200 hover:shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Personal Information</CardTitle>
            <CardDescription>
              Tell us a bit about yourself to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4"
              action={action}
              id={form.id}
              onSubmit={form.onSubmit}
              noValidate
            >
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-2 top-7">
                    <User2 className="size-4 text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 group">
                      <Label className="group-hover:text-primary transition-colors duration-200">
                        First Name
                      </Label>
                      <Input
                        placeholder="John"
                        type="text"
                        key={fields.firstName.key}
                        name={fields.firstName.name}
                        defaultValue={fields.firstName.initialValue}
                        className="pl-8 transition-all duration-200 hover:border-primary focus:border-primary"
                      />
                      {fields.firstName.errors && (
                        <p className="text-destructive text-sm animate-fade-in">
                          {fields.firstName.errors}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 group">
                      <Label className="group-hover:text-primary transition-colors duration-200">
                        Last Name
                      </Label>
                      <Input
                        placeholder="Doe"
                        type="text"
                        key={fields.lastName.key}
                        name={fields.lastName.name}
                        defaultValue={fields.lastName.initialValue}
                        className="transition-all duration-200 hover:border-primary focus:border-primary"
                      />
                      {fields.lastName.errors && (
                        <p className="text-destructive text-sm animate-fade-in">
                          {fields.lastName.errors}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="relative space-y-2 group">
                  <Label className="group-hover:text-primary transition-colors duration-200">
                    Address
                  </Label>
                  <div className="relative">
                    <div className="absolute left-2 top-1/2 -translate-y-1/2">
                      <MapPin className="size-4 text-muted-foreground" />
                    </div>
                    <Input
                      placeholder="123 Main Street"
                      type="text"
                      key={fields.address.key}
                      name={fields.address.name}
                      defaultValue={fields.address.initialValue}
                      className="pl-8 transition-all duration-200 hover:border-primary focus:border-primary"
                    />
                  </div>
                  {fields.address.errors && (
                    <p className="text-destructive text-sm animate-fade-in">
                      {fields.address.errors}
                    </p>
                  )}
                </div>
              </div>

              <CardFooter className="px-0 pb-0">
                <SubmitButton text="Complete Setup" />
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default OnBoardingPage;
