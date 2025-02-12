import React from "react";
import { reqUser } from "../utils/hooks";

import DashboardSideBar from "@/components/dashboard/DashboardSideBar";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { prisma } from "../utils/db";
import { redirect } from "next/navigation";

const getUser = async (userId: string) => {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      firstName: true,
      lastName: true,
      address: true,
    },
  });
  if (!data?.firstName || !data.lastName || !data.address) {
    return redirect("/onboarding");
  }
};
const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await reqUser();
  await getUser(session.user?.id as string);

  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <DashboardSideBar />
        <div className="flex flex-col">
          <DashboardNav />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
