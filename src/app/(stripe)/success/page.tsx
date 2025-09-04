"use client"

import { CardWrapper } from "@/components/card-wrapper"
import { Site_name } from '@/texts-and-menues/site-name'
export default function Home() {
  return (
    <CardWrapper>
      <h1>Congratulations! Your purchase was successful!</h1>
      <p>
        go back to dashboard <a href={Site_name.platform_path} > here</a> to go to your dashboard.
      </p>
    </CardWrapper >
  )
}
