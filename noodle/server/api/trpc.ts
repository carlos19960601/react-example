import { db } from "@/db";
import { initTRPC } from "@trpc/server";
import { NextRequest } from "next/server";

const t = initTRPC.context<typeof createTRPCContext>().create();

export const createTRPCContext = (opts: { req: NextRequest }) => {
    return {
        db,
    }
};


export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
