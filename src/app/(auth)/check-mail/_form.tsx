"use client"

import { LoginButton } from "@/components/buttons/login-button"
import { CardWrapper } from "@/components/card-wrapper"
import { FormSuccess } from "@/components/form_message/form-success"
import { Button } from "@/components/ui/button"

export const NewcheckmailForm = () => {
  const success = "Account created check your mail account verification"

  return (
    <CardWrapper>
      <div className="min-h-80 items-center w-full justify-center">
        <FormSuccess message={success} />
        <div className=" mt-24  ">
          <LoginButton />
        </div>
      </div>
    </CardWrapper >
  )
}
