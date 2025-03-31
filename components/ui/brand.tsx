"use client"

import Link from "next/link"
import { FC } from "react"
import { ChatbotUISVG } from "../icons/chatbotui-svg"

export const Brand: FC = () => {
  return (
    <Link
      className="flex cursor-pointer flex-col items-center hover:opacity-50"
      href="https://www.etogruppe.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="mb-2">
        <ChatbotUISVG scale={1.8} />
      </div>

      <div className="text-4xl font-bold tracking-wide">ETO Knows</div>
    </Link>
  )
}
