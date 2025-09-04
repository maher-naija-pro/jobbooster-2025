"use server"
import { sendcontactEmail } from "@/lib/mail"
import { DemoSchema } from "@/app/company/contact/_schemas"
import { db } from "@/lib/db"
import * as z from "zod"

export const demo = async (values: z.infer<typeof DemoSchema>) => {
  const validatedFields = DemoSchema.safeParse(values)
  console.log("🚀 ~ demo ~ validatedFields:", validatedFields)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { email, message, name } = validatedFields.data
  console.log("🚀 ~ demo ~ name:", name)
  console.log("🚀 ~ demo ~ email:", email)
  console.log("🚀 ~ demo ~ message:", message)

  try {
    await db.contactMessage.create({
      data: {
        name,
        email,
        message
      }
    })
  } catch (error) {
    return {
      error: "cant get your request"
    }
  }
  await db.$disconnect()
  console.log("🚀 ~ sucess")
  sendcontactEmail(name, email, message)
  return { success: "your request registered" }
}
