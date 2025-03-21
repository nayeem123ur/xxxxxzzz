"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    setIsLoggedIn(adminLoggedIn)

    if (!adminLoggedIn && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    setIsLoggedIn(false)
    router.push("/admin/login")
  }

  if (!isLoggedIn && pathname !== "/admin/login") {
    return null
  }

  if (pathname === "/admin/login") {
    return children
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-zinc-900 to-blue-900 text-white">
      <nav className="bg-white/10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/admin/dashboard" className="text-2xl font-bold">
            Admin Panel
          </Link>
          <div className="space-x-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="ghost">Users</Button>
            </Link>
            <Link href="/admin/deposits">
              <Button variant="ghost">Deposits</Button>
            </Link>
            <Link href="/admin/withdrawals">
              <Button variant="ghost">Withdrawals</Button>
            </Link>
            <Link href="/admin/wallet">
              <Button variant="ghost">Wallet</Button>
            </Link>
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  )
}

