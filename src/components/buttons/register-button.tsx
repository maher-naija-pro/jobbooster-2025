"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface RegisterButtonProps {
  children: React.ReactNode
  mode?: "modal" | "redirect"
  asChild?: boolean
}

export const RegisterButton = () => {


  return (
    <Link className="cursor-pointer" key="register" href="/register">
      <Button
        variant="default"
        className="text-base font-semibold mr-5 py-2 px-8 w-full"
      >
        Register
      </Button >
    </Link>
  )
}
