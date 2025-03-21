"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useAuth } from "../hooks/useAuth"
import TradingChartAnimation from "../components/TradingChartAnimation"
import AnimatedButtonBackground from "../components/AnimatedButtonBackground"
import { toast } from "react-hot-toast"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { register } = useAuth()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [buttonSize, setButtonSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (buttonRef.current) {
      const { width, height } = buttonRef.current.getBoundingClientRect()
      setButtonSize({ width, height })
    }
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (register(email, password)) {
      toast.success("Account created successfully!")
      router.push("/login")
    } else {
      setError("Email already in use")
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      <TradingChartAnimation />
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <Card className="w-full max-w-md bg-black/30 border-none shadow-2xl backdrop-blur-md z-10">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center text-white/70">Sign up to start trading</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="relative">
              <AnimatedButtonBackground width={buttonSize.width} height={buttonSize.height} />
              <Button
                ref={buttonRef}
                type="submit"
                className="w-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 hover:from-green-500 hover:via-blue-600 hover:to-purple-700 transition-all duration-300 text-white font-bold py-2 text-lg rounded-md relative z-10"
              >
                Register
              </Button>
            </div>
          </form>
          <div className="mt-6 text-center text-white/70">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 hover:underline">
              Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

