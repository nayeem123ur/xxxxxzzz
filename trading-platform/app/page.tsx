"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if we're in the browser environment before accessing localStorage
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
      if (isLoggedIn) {
        router.push("/trade")
      } else {
        router.push("/login")
      }
    }
  }, [router])

  // Return a loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-zinc-900 to-blue-900 flex items-center justify-center">
      <div className="text-white text-2xl">Loading...</div>
    </div>
  )
}

