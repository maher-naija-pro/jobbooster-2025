import { Logo } from "@/components/Logo"
import { LoginButton } from "@/components/buttons/login-button"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RiMenuFill, RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";
import { Icons } from "@/components/icons"
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import routeList from "@/texts-and-menues/menu"
import Link from "next/link"
import { useState } from "react"
import { useApp } from "@/lib/app-context"

interface RouteProps {
  href: string
  label: string
}

const Mobile_sidebar = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { dispatch } = useApp();

  const handleLogin = () => {
    router.push("/login");
  };

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
    setIsOpen(false); // Close mobile menu
  };

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({})

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }))
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button
        onClick={() => setIsOpen(true)}
        aria-label="open mobile menu"
        variant="ghost"
        className="lg:hidden p-2 hover:bg-gray-100"
      >
        <RiMenuFill size={24} />
      </Button>

      <SheetContent className="w-full sm:max-w-md" side="right">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Logo withLink={true} />
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Auth Section */}
          <div className="mt-6">
            <Link href={user ? "/" : "/login"}>
              <Button
                onClick={() => (user ? (signOut(), setIsOpen(false)) : (handleLogin(), setIsOpen(false)))}
                className="w-full py-3 text-base font-semibold"
                variant={user ? "outline" : "default"}
              >
                {user ? "Logout" : "Login"}
                <Icons.next className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 mt-8">
            <nav className="space-y-1">
              {Object.keys(routeList).map(template_name => {
                //@ts-ignore
                const route = routeList[template_name]

                //@ts-ignore
                if (route.menu == "false") {
                  return (
                    <Link
                      key={template_name}
                      href={route.href}
                      onClick={template_name === "Home" ? handleHomeClick : () => setIsOpen(false)}
                      className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      {template_name}
                    </Link>
                  )
                } else {
                  // Handle dropdown menu
                  const isExpanded = expandedMenus[template_name]
                  return (
                    <div key={template_name}>
                      <button
                        onClick={() => toggleMenu(template_name)}
                        className="w-full flex items-center justify-between px-3 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {template_name}
                        {isExpanded ? (
                          <RiArrowDownSLine className="h-4 w-4" />
                        ) : (
                          <RiArrowRightSLine className="h-4 w-4" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="ml-4 space-y-1">
                          {route.items.map((item: any) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }
              })}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Mobile_sidebar
