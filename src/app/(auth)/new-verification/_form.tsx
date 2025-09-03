"use client"

import { newVerification } from "@/app/(auth)/new-verification/_actions"

import { LoginButton } from "@/components/buttons/login-button"
import { CardWrapper } from "@/components/card-wrapper"
import { FormError } from "@/components/form_message/form-error"
import { FormSuccess } from "@/components/form_message/form-success"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { BarLoader } from "react-spinners"
export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const searchParams = useSearchParams()

  const token = searchParams.get("token")

  const onSubmit = useCallback(() => {
    if (success || error) return

    if (!token) {
      setError("Missing token!")
      return
    }

    newVerification(token)
      .then(data => {
        setSuccess(data.success)
        setError(data.error)
      })
      .catch(() => {
        setError("Something went wrong!")
      })
  }, [token, success, error])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <>
      <CardWrapper>
        <div className="min-h-80 p-10 items-center w-full justify-center">
          {!success && !error && < BarLoader />}
          {!success && !error && <div className="font-semibold text-lg selection:item-center mt-5  "> Loadding....</div>}
          <FormSuccess message={success} />

          {!success && <FormError message={error} />}
          {success && (
            <div className=" mt-5  ">
              <LoginButton />
            </div>
          )}
        </div >
      </CardWrapper >
    </>
  )
}
