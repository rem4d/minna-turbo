import type { AppRouter } from "@rem4d/api";
import React, { useState } from "react";
import { retrieveLaunchParams } from "@/utils/tgUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createTRPCClient,
  httpBatchLink,
  httpLink,
  splitLink,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";

/**
 * A set of typesafe hooks for consuming your API.
 */
// export const api = createTRPCReact<AppRouter>();
// export { type RouterInputs, type RouterOutputs } from "@rem4d/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

export const trpc = createTRPCContext<AppRouter>();
// const trpc2  = createTRPCReact<AppRouter>();
export const { useTRPC } = trpc;

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */
export function ApiProvider(props: { children: React.ReactNode }) {
  const { initDataRaw } = retrieveLaunchParams();

  const url = `${import.meta.env.VITE_API_SERVER}trpc/api`;
  const h = new Map<string, string>();
  h.set("x-trpc-source", "client");
  h.set("Authorization", `tma ${initDataRaw}`);

  const h_ = Object.fromEntries(h);
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        // loggerLink({
        //   enabled: (opts) =>
        //     process.env.NODE_ENV === "development" ||
        //     (opts.direction === "down" && opts.result instanceof Error),
        //   colorMode: "ansi",
        // }),
        splitLink({
          condition(op) {
            return op.context.skipBatch === true;
          },
          // when condition is true, use normal request
          true: httpLink({
            url,
            headers() {
              return h_;
            },
          }),
          // when condition is false, use batching
          false: httpBatchLink({
            url,
            headers() {
              return h_;
            },
          }),
        }),
      ],
    }),
  );
  return (
    <trpc.TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.TRPCProvider>
  );
}
