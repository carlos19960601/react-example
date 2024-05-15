
import { waitlistRouter } from "./routers/waitlist"
import { weatherRouter } from "./routers/weather"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
    waitlist: waitlistRouter,
    weather: weatherRouter,


})
// 这个类型将在后面用作参考...
export type AppRouter = typeof appRouter
