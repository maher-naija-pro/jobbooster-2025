"use client"

import Mobile_sidebar from "@/app/layout/mobile_sidebar"
import Nav_buttons from "@/app/layout/nav_buttons"
import Nav_desktop from "@/app/layout/nav_desktop"
import { Logo } from "@/components/Logo"
import { useApp } from "@/lib/app-context";
import Link from "next/link";

const Navbar = () => {
  const { dispatch } = useApp();

  const handleLogoClick = () => {
    // Reset all generator state
    dispatch({ type: 'CLEAR_CV_DATA' });
    dispatch({ type: 'CLEAR_JOB_OFFER' });
    dispatch({ type: 'CLEAR_CV_ANALYSIS' });
    dispatch({ type: 'CLEAR_GENERATED_CONTENT' });
    dispatch({ type: 'STOP_GENERATION' });
    dispatch({ type: 'STOP_CV_ANALYSIS' });
    dispatch({ type: 'STOP_JOB_ANALYSIS' });
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="  px-4 sm:px-6 lg:px-8">  
        <div className="flex justify-between items-center ">  
          <div className=""> 
            <Link
              href="/"
              onClick={handleLogoClick}
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              <Logo withLink={false} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-8">
            <Nav_desktop />
          </div>

          {/* Desktop Auth & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex">
              <Nav_buttons />
            </div>
            <Mobile_sidebar />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
