import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function reqUser() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function checkUser() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }
  return session;
}
