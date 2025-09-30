"use server"

import { db } from "@/lib/db"

export const Save_user_query = async (
    jobdescription: string,
    pdfname: string,
    callbackUrl?: string | null
) => {

    try {
        await db.contactMessage.create({
            data: {
                name: pdfname,
                message: jobdescription
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
