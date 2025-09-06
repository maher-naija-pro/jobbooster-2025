import { Icons } from "@/components/icons"
import ListSocial from "@/texts-and-menues/socials-link"
import Link from "next/link"
import { getFeatureFlag } from "@/lib/feature-flags"

export const Social_links = () => {
  // Check if social icons are enabled via feature flag
  const isSocialIconsEnabled = getFeatureFlag('ENABLE_SOCIAL_ICONS')

  // Return null if social icons are disabled
  if (!isSocialIconsEnabled) {
    return null
  }

  return (
    <div className="flex gap-4 mt-4 justify-center lg:justify-start">
      {" "}
      {Object.keys(ListSocial).map(item => {
        // @ts-ignore
        const Icon = Icons[ListSocial[item].icon] || Icons.arrowRight
        // @ts-ignore
        const Href = ListSocial[item].href || "/"
        // @ts-ignore
        const name = ListSocial[item].name || "/"
        return (
          <div key={name} className="flex group">
            <Link href={Href} className="flex flex-col justify-center items-center  ">
              <Icon className=" group-hover:scale-125 size-7  group-hover:text-slate-400   " />
              <div className=" sm:flex md:text-xs   group-hover:text-slate-400  ">{name}</div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default Social_links
