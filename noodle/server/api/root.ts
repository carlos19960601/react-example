
import { testRouter } from "./routers/test"
import { weatherRouter } from "./routers/weather"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
    test: testRouter,
    weather: weatherRouter,


})
// 这个类型将在后面用作参考...
export type AppRouter = typeof appRouter
