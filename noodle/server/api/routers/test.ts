import { createTRPCRouter, publicProcedure } from "../trpc";

export const testRouter = createTRPCRouter({
    getData: publicProcedure.query(async () => {
        // 在真实应用中，你需要在这里从数据库获取数据
        console.log("getData")
        return "xoixixixix"
    }),

});
