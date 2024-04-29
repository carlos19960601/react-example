import { createTRPCRouter, publicProcedure } from "../trpc";

export const authorRouter = createTRPCRouter({
    count: publicProcedure.query(({ ctx }) => ctx.db.author.count()),
});

