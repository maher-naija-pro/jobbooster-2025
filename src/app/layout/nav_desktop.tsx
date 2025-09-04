import routeList from "@/texts-and-menues/menu"
import Link from "next/link"

const Nav_desktop = () => {
  return (
    <nav className="flex items-center space-x-1">
      <ul className="flex items-center space-x-1">
        {Object.keys(routeList).map(template_name => {
          //@ts-ignore
          if (routeList[template_name].menu == "false")
            return (
              <Link
                key={template_name}
                //@ts-ignore
                href={routeList[template_name].href}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                {template_name}
              </Link>
            )
        })}
      </ul>
    </nav>
  )
}
export default Nav_desktop
