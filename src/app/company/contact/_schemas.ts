import * as z from "zod";

export const DemoSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Please enter a valid email address",
  }),
  message: z
    .string()
    .min(1, { message: "Please write a message" })
    .min(3, { message: "Message must be at least 3 characters long" }),
  name: z.string().min(1, {
    message: "Name is required",
  }).min(2, {
    message: "Name must be at least 2 characters long",
  }),
});
