import { z } from "zod"

import { publicProcedure, router } from "./trpc"

export const appRouter = router({
    getData: publicProcedure.query(async () => {
        // 在真实应用中，你需要在这里从数据库获取数据
        console.log("getData")
        return "xoixixixix"
    }),
    setData: publicProcedure
        .input(z.string())
        .mutation(async ({ input }) => {
            // 在这里，你将使用方法传入的输入字符串来更新数据库。
            console.log(input)
            return input
        }),
})
// 这个类型将在后面用作参考...
export type AppRouter = typeof appRouter
