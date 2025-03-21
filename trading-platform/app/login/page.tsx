"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useAuth } from "../hooks/useAuth"
import TradingChartAnimation from "../components/TradingChartAnimation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (login(email, password)) {
      router.push("/trade")
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <TradingChartAnimation />
      <div className="absolute inset-0 bg-black/50"></div>
      <Card className="w-full max-w-md bg-black/30 border-none shadow-2xl backdrop-blur-md z-10">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Login to Your Account
          </CardTitle>
          <CardDescription className="text-center text-white/70">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all duration-300 text-white font-bold py-2 text-lg rounded-md"
            >
              Login
            </Button>
          </form>
          <div className="mt-6 text-center text-white/70">
            <Link href="/forgot-password" className="text-purple-400 hover:text-purple-300 hover:underline block mb-2">
              Forgot Password?
            </Link>
            Don't have an account?{" "}
            <Link href="/register" className="text-purple-400 hover:text-purple-300 hover:underline">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

