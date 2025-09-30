/* eslint react/no-unescaped-entities: off */
"use client"

import { demo } from "@/app/company/contact/_action"
import { DemoSchema } from "@/app/company/contact/_schemas"
import { FormError } from "@/components/form_message/form-error"
import { FormSuccess } from "@/components/form_message/form-success"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

export const DemoFormContent = () => {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof DemoSchema>>({
    defaultValues: {
      email: "",
      message: "",
      name: ""
    }
  })

  const onSubmit = (values: z.infer<typeof DemoSchema>) => {
    setError("")
    setSuccess("")
    console.log("🚀 ~ demo~ values")
    startTransition(() => {
      demo(values).then(data => {
        console.log("🚀 ~ register ~ data:", data)
        setSuccess(data?.success)
        setError(data?.error)
        // Clear form after successful submission
        if (data?.success) {
          form.reset()
        }
      })
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <header className="text-center mb-8 pt-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Welcome to our Contact Page! We're here to help and would love to hear from you.
        </p>
      </header>

      {/* Form Section */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          role="form"
          aria-label="Contact form"
        >
          <div className="space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
                  >
                    Full Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="name"
                      className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-200 bg-background text-foreground placeholder-muted-foreground"
                      disabled={isPending}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      aria-describedby="name-error"
                      aria-required="true"
                    />
                  </FormControl>
                  <FormMessage id="name-error" />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
                  >
                    Email Address *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      disabled={isPending}
                      autoComplete="email"
                      className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-200 bg-background text-foreground placeholder-muted-foreground"
                      placeholder="your.email@example.com"
                      type="email"
                      aria-describedby="email-error"
                      aria-required="true"
                    />
                  </FormControl>
                  <FormMessage id="email-error" />
                </FormItem>
              )}
            />

            {/* Message Field */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="message"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
                  >
                    Message *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="message"
                      className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-200 bg-background text-foreground placeholder-muted-foreground resize-vertical min-h-[120px]"
                      disabled={isPending}
                      placeholder="Please tell us how we can help you..."
                      aria-describedby="message-error"
                      aria-required="true"
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage id="message-error" />
                </FormItem>
              )}
            />
          </div>

          {/* Status Messages */}
          <div className="space-y-4">
            <FormSuccess message={success} />
            <FormError message={error} />
          </div>

          {/* Submit Button */}
          <div className="pt-4 pb-8">
            <Button
              disabled={isPending}
              type="submit"
              className="w-full py-4 px-6 font-semibold"
              aria-describedby={isPending ? "loading-message" : undefined}
            >
              {isPending ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sending Message...
                </span>
              ) : (
                "Send Message"
              )}
            </Button>
            {isPending && (
              <p id="loading-message" className="sr-only">
                Please wait while we send your message
              </p>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
