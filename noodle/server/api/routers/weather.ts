import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";


const input = z.object({
    latitude: z.number(),
    longitude: z.number(),
})



const weatherDataSchema = z.object({
    temp_max: z.number(),
    temp_min: z.number(),
    summary: z.string().optional(),
});

const hours = z
    .object({
        summary: z.object({
            symbol_code: z.string(),
        }),
    })
    .optional();

const timeseriesSchema = z.array(
    z.object({
        time: z.string(),
        data: z.object({
            next_12_hours: hours,
            next_6_hours: hours,
            next_1_hours: hours,
            instant: z.object({
                details: z.object({
                    air_temperature: z.number(),
                }),
            }),
        }),
    }),
);


export const weatherRouter = createTRPCRouter({
    getWeatherData: publicProcedure.input(input).output(weatherDataSchema).query(async ({ input, ctx }) => {
        console.log("11111111")
        // const date = new Date().toISOString().slice(0, 10);
        // const cacheKey = `weather:${date}:${ctx.auth?.userId}`;

        // if (typeof ctx.redis !== "undefined" && typeof ctx.redis != "string") {
        //     try {
        //         const cachedWeatherData = await ctx.redis.get(cacheKey);

        //         if (!cachedWeatherData) {

        //         }
        //     } catch (error) {
        //         throw new TRPCError({
        //             code: "INTERNAL_SERVER_ERROR",
        //             message: "Failed to fetch cached weather data",
        //         });
        //     }
        // }


        // try {
        //     return getCurrentWeatherData(input);
        // } catch (error) {
        //     throw new TRPCError({
        //         code: "INTERNAL_SERVER_ERROR",
        //         message: "Failed to fetch weather data",
        //     });
        // }

        return {
            summary: "dsaad",
            temp_max: 10,
            temp_min: 0
        }
    }),

});
