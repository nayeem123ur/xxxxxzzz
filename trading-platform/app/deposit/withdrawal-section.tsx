"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet } from "lucide-react"
import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { toast } from "react-hot-toast"

export default function WithdrawalSection() {
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("")
  const [account, setAccount] = useState("")
  const { currentUser, balance, updateBalance, requestWithdrawal } = useAuth()

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !amount || !method || !account) return

    const withdrawalAmount = Number.parseFloat(amount)
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0 || withdrawalAmount > balance) {
      toast.error("Invalid withdrawal amount")
      return
    }

    if (requestWithdrawal(withdrawalAmount, method, account)) {
      updateBalance(balance - withdrawalAmount)
      toast.success("Withdrawal request submitted successfully!")
      setAmount("")
      setMethod("")
      setAccount("")
    } else {
      toast.error("Failed to submit withdrawal request")
    }
  }

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card className="bg-white/10 border-none shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-white/70">Available Balance</p>
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                ${balance.toFixed(2)}
              </p>
            </div>
            <Wallet className="h-12 w-12 text-blue-400" />
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Form */}
      <Card className="bg-white/10 border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
            Withdrawal Details
          </CardTitle>
          <CardDescription className="text-white/70">Enter your withdrawal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleWithdrawal} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdrawal-amount" className="text-white">
                Amount (USD)
              </Label>
              <Input
                id="withdrawal-amount"
                placeholder="Enter amount"
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder-white/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Withdrawal Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-white/10">
                  <SelectItem value="binance" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3220935d7c57f0f620a1a168225be1f32d4764ca5620240f92f0479f72cee31a_200-CyKCQ3Pj2qZy6Q94Iah1bQ2zvOucIa.webp"
                        alt="Binance"
                        className="h-5 w-5"
                      />
                      <span>Binance</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="bkash" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5e6ab3fa58a91-BbAMlxhf1SXdKsyMR1nazsa87I9C0b.png"
                        alt="bKash"
                        className="h-5 w-5"
                      />
                      <span>bKash</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="nagad" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unnamed-el099RmtYkXOUCkUonIKYAgO0KH04M.png"
                        alt="Nagad"
                        className="h-5 w-5"
                      />
                      <span>Nagad</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="account" className="text-white">
                Account Details
              </Label>
              <Input
                id="account"
                placeholder="Enter account number or wallet address"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder-white/50"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 transition-all duration-300 text-white font-bold py-3 text-lg"
            >
              Submit Withdrawal Request
            </Button>
          </form>
          <p className="mt-4 text-sm text-white/70">Note: Withdrawal requests are subject to admin approval.</p>
        </CardContent>
      </Card>
    </div>
  )
}

