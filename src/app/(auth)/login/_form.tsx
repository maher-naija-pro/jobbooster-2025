"use client"
import { Site_name } from '@/texts-and-menues/site-name'
import { Social } from '@/app/(auth)/_components_auth/social'
import { ResetFormContent } from '@/app/(auth)/reset-password/_formcontant'
import { login } from '@/app/(auth)/login/_action'
import { LoginSchema } from '@/app/(auth)/login/_schemas'
import { CardWrapper } from "@/components/card-wrapper"
import { FormError } from "@/components/form_message/form-error"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"
import { useState, useTransition } from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface FormErrorProps {
  message?: string
}

export const LoginForm = () => {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })
  const { data: session, status } = useSession()
  useEffect(() => {
    if (session) {
      router.push("/")
    }
  }, [session])
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("")
    startTransition(() => {
      login(values, Site_name.platform_path)
        .then(data => {
          if (data?.error) {
            form.reset()
            setError(data.error)
          }
        })
        .catch(() => setError("Something went wrong"))
      console.log("all ok ")
    })
  }
  return (
    <>
      <CardWrapper>
        <div className="  text-center mt-2 text-2xl  ">Sign-In </div>
        <p className="mt-3 mb-3 px-3">New here? </p>
        <Link className="font-semibold  text-blue-900 hover:text-red-400" href="/register">
          <Button className="px-0  mb-4 border bg-slate-50 text-slate-900  hover:bg-slate-900 hover:text-slate-50 dark:hover:bg-slate-900 dark:hover:text-slate-50 border-slate-400 font-semibold text-base w-full">
            Sign-up{" "}
          </Button>
        </Link>

        <Form {...form}>
          <div className="grid grid-cols-4 items-center  py-3">
            <div className="col-span-1 ">
              <Separator />
            </div>
            <div className="text-center text-sm col-span-2 ml-4 mr-4">Social Sign-in</div>
            <div className="col-span-1">
              <Separator />
            </div>
          </div>
          <Social />
          <div className="grid grid-cols-5 py-3 gap-5">
            <div className="col-span-2">
              <Separator />
            </div>

            <div className="text-center">or</div>

            <div className="col-span-2">
              <Separator />
            </div>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="hover:scale-105 dark:hover:bg-slate-700 hover:bg-slate-200 bg-muted/50  "
                      disabled={isPending}
                      autoComplete="o"
                      placeholder="YourEmail@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      className="hover:scale-105 dark:hover:bg-slate-700 hover:bg-slate-200 bg-muted/50  "
                      autoComplete="o"
                      placeholder="**********"
                      type="Password"
                    />
                  </FormControl>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button

                        size="sm"
                        variant="link"
                        className="text-sm font-semibold underline hover:text-red-900 px-0 "
                      >
                        Forgot password?
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle >Forgot password?</DialogTitle>
                      </DialogHeader>
                      <ResetFormContent />
                    </DialogContent>
                  </Dialog>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending}
              type="submit"
              className="border bg-slate-900 text-slate-50  hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-50  dark:hover:text-slate-900 border-slate-900 font-semibold text-base w-full"
            >
              <a> {isPending ? "Loading..." : "Login"}</a>
            </Button>{" "}
            <FormError message={error} />
          </form>{" "}
        </Form>
        <p className=" mt-8 text-xs text-center">
          By signing in, you agree to our
          <Link className=" font-bold  text-sm cursor-pointer" href="/legal/terms-of-service">
            {" "}
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link className=" font-bold  text-sm cursor-pointer" href="/legal/privacy-policy">
            Privacy Policy
          </Link>
          .
        </p>
      </CardWrapper >
    </>
  )
}
