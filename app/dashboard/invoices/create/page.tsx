import { prisma } from "@/app/utils/db";
import { reqUser } from "@/app/utils/hooks";
import CreateInvoice from "@/components/dashboard/CreateInvoice";
import React from "react";

async function getUserData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      firstName: true,
      lastName: true,
      address: true,
      email: true,
    },
  });
  return data;
}
const CreateInvoicePage = async () => {
  const user = await reqUser();
  const data = await getUserData(user.user?.id as string);
  return (
    <div>
      <CreateInvoice
        address={data?.address as string}
        lastName={data?.lastName as string}
        firstName={data?.firstName as string}
        email={data?.email as string}
      />
    </div>
  );
};

export default CreateInvoicePage;
