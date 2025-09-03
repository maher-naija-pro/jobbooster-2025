
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react"
export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className="   ">
        {" "}
        <main className="mt-4 mb-4 ">
          <SessionProvider>
            <Suspense>{children}</Suspense>
          </SessionProvider>
        </main >
      </div >
    </>
  )
}
