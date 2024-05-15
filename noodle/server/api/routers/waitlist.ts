import { insertWaitlist, waitlist } from "@/db/schema/waitlist";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const waitlistRouter = createTRPCRouter({
    addToWaitList: publicProcedure.input(insertWaitlist).mutation(async ({ ctx, input }) => {
        try {
            await ctx.db.insert(waitlist).values({
                email: input.email,
                name: input.name,
                reason: input.reason,
            });
        }
        catch (err) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "You are already on the waitlist",
            });
        }
    }),
    getWaitlist: publicProcedure.query(async ({ ctx }) => {
        const waitList = await ctx.db.select().from(waitlist);
        return waitList;
    }),
    sendUserInvitation: publicProcedure.input(z.object({ invitationId: z.number() })).mutation(async ({ input, ctx }) => {
        const { invitationId } = input;

        const invitation = await ctx.db
            .select()
            .from(waitlist)
            .where(eq(waitlist.id, invitationId))
            .limit(1);

        if (invitation.length > 0 && invitation[0]) {

            await ctx.db
                .update(waitlist)
                .set({ invitationSentAt: new Date().toDateString() })
                .where(eq(waitlist.id, invitationId));
        }

        return invitation;

    })
})