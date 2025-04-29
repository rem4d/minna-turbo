import type { AppRouter } from "@rem4d/api";
import { useState } from "react";
import { retrieveLaunchParams } from "@/utils/tgUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { httpBatchLink, httpLink, loggerLink, splitLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";

/**
 * A set of typesafe hooks for consuming your API.
 */
export const api = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from "@rem4d/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */
export function TRPCProvider(props: { children: React.ReactNode }) {
  const { initDataRaw } = retrieveLaunchParams();

  const url = `${import.meta.env.VITE_API_SERVER}trpc/api`;
  const h = new Map<string, string>();
  h.set("x-trpc-source", "client");
  h.set("Authorization", `tma ${initDataRaw}`);

  const h_ = Object.fromEntries(h);

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
          colorMode: "ansi",
        }),
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
        /*httpBatchLink({
          // transformer: superjson,
          url: `${import.meta.env.VITE_API_SERVER}trpc/api`,
          headers() {
            const headers = new Map<string, string>();
            headers.set("x-trpc-source", "client");
            headers.set("Authorization", `tma ${initDataRaw}`);

            return Object.fromEntries(headers);
          },
        }),
        */
      ],
    }),
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </api.Provider>
  );
}
