import routeList from "@/texts-and-menues/menu"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon } from "lucide-react"

const Nav_desktop = () => {
  return (
    <nav className="flex items-center space-x-1">
      <ul className="flex items-center space-x-1">
        {Object.keys(routeList).map(template_name => {
          //@ts-ignore
          const route = routeList[template_name]

          //@ts-ignore
          if (route.menu == "false") {
            return (
              <Link
                key={template_name}
                href={route.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                {template_name}
              </Link>
            )
          } else {
            // Handle dropdown menu
            return (
              <DropdownMenu key={template_name}>
                <DropdownMenuTrigger className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1">
                  {template_name}
                  <ChevronDownIcon className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {route.items.map((item: any) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="w-full">
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          }
        })}
      </ul>
    </nav>
  )
}
export default Nav_desktop
