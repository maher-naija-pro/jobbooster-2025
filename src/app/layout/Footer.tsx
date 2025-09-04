import Social_links from "@/app/layout/social_link"
import { Logo } from "@/components/Logo"
import templates from "@/texts-and-menues/footer"
import Link from "next/link"
import { Site_name } from "@/texts-and-menues/site-name"

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Logo Section */}
          <div className="lg:col-span-2 text-center lg:text-left">
            <Logo withLink={true} />
            <div className="mt-4">
              <Social_links />
            </div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center lg:text-left">
            {Object.keys(templates).map(template_name => {
              return (
                <div key={template_name} className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    {template_name}
                  </h4>
                  <ul className="space-y-2">
                    {
                      //@ts-ignore
                      templates[template_name].items.map(item => {
                        return (
                          <li key={item.name}>
                            <Link
                              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                              href={item.href}
                            >
                              {item.name}
                            </Link>
                          </li>
                        )
                      })
                    }
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-sm text-gray-600 text-center">
            © {new Date().getFullYear()}{" "}
            <Link
              href="/"
              className="text-gray-900 hover:text-blue-600 transition-colors font-medium"
            >
              {Site_name.company}
            </Link>
            , All rights reserved
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
