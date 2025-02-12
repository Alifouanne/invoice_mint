import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loadingCreate = () => {
  return <Skeleton className="w-full h-full flex-1" />;
};

export default loadingCreate;
