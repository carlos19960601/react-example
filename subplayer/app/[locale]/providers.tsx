"use client";

import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Receive messages provided in `i18n.ts`
  return <NextUIProvider>{children}</NextUIProvider>;
}
