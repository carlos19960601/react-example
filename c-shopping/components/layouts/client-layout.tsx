import { Header } from "@/components";
import { PropsWithChildren } from "react";

export default function ClientLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
