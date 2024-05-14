import { apiHandler } from "@/helpers/api";
import { NextRequest } from "next/server";

const getUsers = apiHandler(async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const page = +(searchParams.get("page") || 1)
    const pageSize = +(searchParams.get('page_size') || 5)

    const result = await usersRepo.getAll({ page, pageSize })

    return setJson({
        data: result
    })
}


    export const GET = getUsers;