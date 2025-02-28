"use client"

import * as React from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col max-w-[100vw] w-[100vw] min-w-[100vw] max-h-[100vh] h-[100vh] min-h-[100vh] p-3">
      {children}
    </div>
  )
}

