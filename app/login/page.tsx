import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "../utils/auth";
import { SubmitButton } from "@/components/global/SubmitButtons";
import { checkUser } from "../utils/hooks";
import { Mail } from "lucide-react";

const LoginPage = async () => {
  await checkUser();

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      </div>
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 bg-gradient-to-b from-white to-gray-50/50">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 animate-fade-in">
            Welcome Back!
          </h1>
          <p className="text-gray-500">We&apos;re glad to see you again</p>
        </div>

        <Card className="w-full max-w-sm transition-all duration-300 hover:shadow-lg">
          <CardHeader className="space-y-2">
            <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce-subtle">
              <Mail className="size-6 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Use your email address to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-y-4"
              action={async (formData) => {
                "use server";
                await signIn("nodemailer", formData);
              }}
            >
              <div className="flex flex-col gap-y-2 group">
                <Label className="group-hover:text-primary transition-colors duration-200">
                  Email Address
                </Label>
                <Input
                  placeholder="you@example.com"
                  name="email"
                  type="email"
                  required
                  className="transition-all duration-200 hover:border-primary focus:border-primary"
                />
              </div>
              <div className="mt-2">
                <SubmitButton text="login" />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
