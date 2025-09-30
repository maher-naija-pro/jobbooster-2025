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
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

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

  // Handle hover events for Legal dropdown
  const handleLegalMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setShowLegalCards(true);
  };

  const handleLegalMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowLegalCards(false);
    }, 150); // Small delay to prevent flickering
    setHoverTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);
  return (
    <nav className="flex items-center space-x-1">
      <ul className="flex items-center space-x-1">
        {(Object.keys(routeList) as Array<keyof typeof routeList>).map(template_name => {
          const route = routeList[template_name]
          if (!route) return null

          if (route.menu == "false") {
            return (
              <Link
                key={template_name}
                href={route.href}
                onClick={template_name === "Home" ? handleHomeClick : undefined}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all duration-200 hover:scale-105"
              >
                {template_name}
              </Link>
            )
          } else if (template_name === "Legal") {
            // Special handling for Legal section with hover-based dropdown
            return (
              <div
                key={template_name}
                className="relative"
                ref={legalRef}
                onMouseEnter={handleLegalMouseEnter}
                onMouseLeave={handleLegalMouseLeave}
              >
                <button
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all duration-200 flex items-center gap-1 group"
                >
                  {template_name}
                  <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${showLegalCards ? 'rotate-180' : ''}`} />
                </button>

                {showLegalCards && (
                  <div className="absolute top-full left-0 mt-1 w-48 z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-1">
                      {route.items.map((item: any) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-150"
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
                <DropdownMenuTrigger className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all duration-200 flex items-center gap-1 hover:scale-105 group">
                  {template_name}
                  <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="animate-in fade-in-0 slide-in-from-top-2 duration-200">
                  {route.items.map((item: any) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="w-full transition-colors duration-150">
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
