import { Logo } from "@/components/Logo"
import { LoginButton } from "@/components/buttons/login-button"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RiMenuFill } from "react-icons/ri";
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

interface RouteProps {
  href: string
  label: string
}

const Mobile_sidebar = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const handleLogin = () => {
    router.push("/login");
  };
  const [isOpen, setIsOpen] = useState<boolean>(false)

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
                return (
                  <Link
                    key={template_name}
                    //@ts-ignore
                    href={routeList[template_name].href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {template_name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Mobile_sidebar
