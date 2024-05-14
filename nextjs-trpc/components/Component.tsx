"use client";

import { trpc } from "@/trpc/client";

const Component = () => {
  const { data } = trpc.getData.useQuery();
  return <div>{data}</div>;
};

export default Component;
