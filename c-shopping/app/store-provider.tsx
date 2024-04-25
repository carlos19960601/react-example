"use client";

import { Provider } from "jotai";
import { PropsWithChildren } from "react";

export default function StoreProvider({ children }: PropsWithChildren) {
  return <Provider>{children}</Provider>;
}
