"use server"

import db from "@/lib/db/db"

export const Save_user_query = async (
    jobdescription: string,
    pdfname: string,
    callbackUrl?: string | null
) => {

    try {
        await db.query.create({
            data: {
                pdfname,
                jobdescription
            }
        })
    } catch (error) {
        console.log(error)
        await db.$disconnect()
        return { error: "error write to db" }
    }
    await db.$disconnect()
    return { success: "your mail was registred" }
}
