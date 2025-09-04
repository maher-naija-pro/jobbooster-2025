import Image from "next/image"
import Link from "next/link"
import { Site_name } from "@/texts-and-menues/site-name"

interface LogoProps {
  withLink?: boolean
  className?: string
}

export const Logo = ({ withLink = true, className = "" }: LogoProps) => {
  const logoContent = (
    <div className={`hover:opacity-80 hover:scale-95 items-center mt-2 flex gap-4 justify-center lg:justify-start ${className}`}>
      <Image src="/logo.svg" alt="Logo" width={50} height={50} />
      <span className="sm:text-2xl text-xl font-bold break-normal text-slate-800">
        {Site_name.siteName}
      </span>
    </div>
  )

  if (withLink) {
    return (
      <Link href="/">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}
