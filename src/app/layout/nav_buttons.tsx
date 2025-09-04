
import { LoginButton } from "@/components/buttons/login-button"
import { AuthProvider } from "@/components/auth/auth-provider";

const Nav_buttons = () => {
  return (
    <div className="container hidden lg:flex gap-4 p-5 ">
      <AuthProvider>
        <LoginButton />
      </AuthProvider>
    </div>
  )
}
export default Nav_buttons
