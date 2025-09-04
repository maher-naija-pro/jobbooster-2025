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
      < Button
        className="border text-slate-900 bg-slate-50 hover:bg-slate-900 hover:text-slate-50 border-slate-700  text-base font-semibold mr-5 py-2 px-8 w-full "
      >
        Register
      </Button >
    </Link>
  )
}
