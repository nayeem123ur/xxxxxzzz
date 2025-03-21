"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"
import { useAuth } from "../hooks/useAuth"

export default function DepositSection() {
  const [amount, setAmount] = useState("")
  const router = useRouter()
  const { updateBalance, balance } = useAuth()

  const handlePaymentMethodClick = (method: string) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    // Instead of updating the balance, we'll just redirect to the payment method page
    router.push(`/deposit/${method.toLowerCase()}?amount=${amount}`)
  }

  return (
    <div className="space-y-6">
      {/* Amount Input */}
      <Card className="bg-white/10 border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
            Deposit Amount
          </CardTitle>
          <CardDescription className="text-white/70">Enter the amount you want to deposit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-white">
              Amount (USD)
            </Label>
            <Input
              id="amount"
              placeholder="Enter amount"
              type="number"
              min="1"
              step="0.01"
              className="bg-white/5 border-white/10 text-white placeholder-white/50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="bg-white/10 border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
            Payment Method
          </CardTitle>
          <CardDescription className="text-white/70">Select your preferred payment method</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Button
            variant="outline"
            className="h-auto flex-col items-center justify-center p-6 hover:bg-white/20 border-white/10 bg-white/5 transition-all duration-300 hover:scale-105"
            onClick={() => handlePaymentMethodClick("Binance")}
          >
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3220935d7c57f0f620a1a168225be1f32d4764ca5620240f92f0479f72cee31a_200-CyKCQ3Pj2qZy6Q94Iah1bQ2zvOucIa.webp"
              alt="Binance"
              className="mb-2 h-8 w-8"
            />
            <span className="text-white">Binance</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col items-center justify-center p-6 hover:bg-white/20 border-white/10 bg-white/5 transition-all duration-300 hover:scale-105"
            onClick={() => handlePaymentMethodClick("Bkash")}
          >
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5e6ab3fa58a91-BbAMlxhf1SXdKsyMR1nazsa87I9C0b.png"
              alt="bKash"
              className="mb-2 h-8 w-8"
            />
            <span className="text-white">Bkash</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col items-center justify-center p-6 hover:bg-white/20 border-white/10 bg-white/5 transition-all duration-300 hover:scale-105"
            onClick={() => handlePaymentMethodClick("Nagad")}
          >
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unnamed-el099RmtYkXOUCkUonIKYAgO0KH04M.png"
              alt="Nagad"
              className="mb-2 h-8 w-8"
            />
            <span className="text-white">Nagad</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

