"use client"

import { DemoFormContent } from "@/app/company/contact/_form_content"
import { CardWrapper } from "@/components/card-wrapper"

export const DemoForm = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto">
        <CardWrapper>
          <DemoFormContent />
        </CardWrapper>
      </div>
    </div>
  )
}
