import { authorRouter } from "./routers/author";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
    author: authorRouter,
});


export type AppRouter = typeof appRouter;