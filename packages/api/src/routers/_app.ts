import { router } from "../trpc";
import { adminRouter } from "./admin/_router";
import { viewerRouter } from "./viewer/_router";

export const appRouter = router({
  admin: adminRouter,
  viewer: viewerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
