import { TRPCReactProvider } from "@/trpc/client";
import { headers } from "next/headers";
import { PropsWithChildren } from "react";
import { DashboardSideMenu } from "../_components/side-menu";
import { SideMenuProvider } from "../_context/side-menu";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <TRPCReactProvider headers={headers()}>
      <SideMenuProvider>
        <div className="relative flex h-screen w-screen overflow-hidden">
          <DashboardSideMenu />
          <div>{children}</div>
        </div>
      </SideMenuProvider>
    </TRPCReactProvider>
  );
}
