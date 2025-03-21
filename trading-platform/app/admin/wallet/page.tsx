"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function WalletPage() {
  const [binanceWallet, setBinanceWallet] = useState("")
  const [bkashWallet, setBkashWallet] = useState("")
  const [nagadWallet, setNagadWallet] = useState("")

  useEffect(() => {
    // Fetch wallet addresses from localStorage or your backend
    const storedWallets = JSON.parse(localStorage.getItem("adminWallets") || "{}")
    setBinanceWallet(storedWallets.binance || "")
    setBkashWallet(storedWallets.bkash || "")
    setNagadWallet(storedWallets.nagad || "")
  }, [])

  const handleSave = () => {
    const wallets = { binance: binanceWallet, bkash: bkashWallet, nagad: nagadWallet }
    localStorage.setItem("adminWallets", JSON.stringify(wallets))
    alert("Wallet addresses saved successfully!")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Wallet Management</h1>
      <Card className="bg-white/10 border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Set Wallet Addresses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="binance-wallet" className="text-sm font-medium text-white">
              Binance Wallet Address
            </label>
            <Input
              id="binance-wallet"
              value={binanceWallet}
              onChange={(e) => setBinanceWallet(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder-white/50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="bkash-wallet" className="text-sm font-medium text-white">
              Bkash Wallet Address
            </label>
            <Input
              id="bkash-wallet"
              value={bkashWallet}
              onChange={(e) => setBkashWallet(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder-white/50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="nagad-wallet" className="text-sm font-medium text-white">
              Nagad Wallet Address
            </label>
            <Input
              id="nagad-wallet"
              value={nagadWallet}
              onChange={(e) => setNagadWallet(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder-white/50"
            />
          </div>
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 transition-all duration-300 text-white font-bold py-2 text-lg"
          >
            Save Wallet Addresses
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

