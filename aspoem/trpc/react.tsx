"use client";

import { AppRouter } from "@/server/api/root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";
import { PropsWithChildren, useState } from "react";

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() => api.createClient({}));

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
