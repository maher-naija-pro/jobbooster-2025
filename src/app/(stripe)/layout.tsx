import { Suspense } from "react"

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className="flex  justify-center  ">
        <main className="px-10 pt-10  ">
          <Suspense>{children}</Suspense>
        </main>
      </div>
    </>
  )
}
