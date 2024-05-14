import { TRPCReactProvider } from "@/trpc/client";
import { headers } from "next/headers";
import { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <TRPCReactProvider headers={headers()}>
      <div>{children}</div>
    </TRPCReactProvider>
  );
}
