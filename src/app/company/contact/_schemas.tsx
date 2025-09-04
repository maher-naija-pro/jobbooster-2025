import * as z from "zod";

export const DemoSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Please enter your full name"
    })
    .min(2, {
      message: "Name must be at least 2 characters long"
    })
    .max(100, {
      message: "Name must be less than 100 characters"
    })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: "Name can only contain letters, spaces, hyphens, and apostrophes"
    }),

  email: z
    .string()
    .min(1, {
      message: "Please enter your email address"
    })
    .email({
      message: "Please enter a valid email address"
    })
    .max(254, {
      message: "Email address is too long"
    }),

  message: z
    .string()
    .min(1, {
      message: "Please enter a message"
    })
    .min(10, {
      message: "Message must be at least 10 characters long"
    })
    .max(1000, {
      message: "Message must be less than 1000 characters"
    })
    .trim()
});
