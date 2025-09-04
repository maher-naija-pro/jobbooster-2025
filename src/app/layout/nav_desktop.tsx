import routeList from "@/texts-and-menues/menu"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon, FileText } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { useState, useEffect, useRef } from "react"

const Nav_desktop = () => {
  const { dispatch } = useApp();
  const [showLegalCards, setShowLegalCards] = useState(false);
  const legalRef = useRef<HTMLDivElement>(null);

  const handleHomeClick = () => {
    // Reset all generator state when home is clicked
    dispatch({ type: 'CLEAR_CV_DATA' });
    dispatch({ type: 'CLEAR_JOB_OFFER' });
    dispatch({ type: 'CLEAR_CV_ANALYSIS' });
    dispatch({ type: 'CLEAR_GENERATED_CONTENT' });
    dispatch({ type: 'STOP_GENERATION' });
    dispatch({ type: 'STOP_CV_ANALYSIS' });
    dispatch({ type: 'STOP_JOB_ANALYSIS' });
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Close legal cards when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (legalRef.current && !legalRef.current.contains(event.target as Node)) {
        setShowLegalCards(false);
      }
    };

    if (showLegalCards) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLegalCards]);
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
                onClick={template_name === "Home" ? handleHomeClick : undefined}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                {template_name}
              </Link>
            )
          } else if (template_name === "Legal") {
            // Special handling for Legal section with Card component
            return (
              <div key={template_name} className="relative" ref={legalRef}>
                <button
                  onClick={() => setShowLegalCards(!showLegalCards)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1"
                >
                  {template_name}
                  <ChevronDownIcon className={`h-4 w-4 transition-transform ${showLegalCards ? 'rotate-180' : ''}`} />
                </button>

                {showLegalCards && (
                  <div className="absolute top-full left-0 mt-2 w-48 z-50">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-1">
                      {route.items.map((item: any) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                          onClick={() => setShowLegalCards(false)}
                        >
                          <FileText className="h-4 w-4 text-blue-600" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          } else {
            // Handle other dropdown menus
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
