import { NextResponse } from "next/server";

function apiHandler(handler, { }) {
    return async (req, ...args) => {
        const responseBody = await handler(req, ...args)
        return NextResponse.json(responseBody || {});
    }
}


export { apiHandler };

