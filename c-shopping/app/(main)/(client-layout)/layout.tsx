import ClientLayout from "@/components/layouts/client-layout";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <ClientLayout>{children}</ClientLayout>
    </>
  );
}
