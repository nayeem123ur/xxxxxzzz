"use client"

import { useState, useEffect } from "react"
import { Bell, LogOut, History, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import TradingChart from "./trading-chart"
import TradingControls from "./trading-controls"
import Link from "next/link"
import { useAuth } from "../hooks/useAuth"
import { Toaster } from "react-hot-toast"
import { toast } from "react-hot-toast"

export default function TradingInterface() {
  const { balance, logout, activeTrade } = useAuth()
  const [currentPair, setCurrentPair] = useState({
    pair: "AUD/CAD",
    type: "OTC",
    percentage: "82",
  })

  const handleMarketChange = (newMarket: string) => {
    const [pair, type] = newMarket.split(" (")
    setCurrentPair({
      pair,
      type: type.slice(0, -1),
      percentage: "82",
    })
  }

  useEffect(() => {
    if (activeTrade) {
      const remainingTime = activeTrade.startTime + activeTrade.duration * 60 * 1000 - Date.now()
      if (remainingTime > 0) {
        const timer = setTimeout(() => {
          toast.success("Your trade has finished. Check your balance for the result.")
        }, remainingTime)
        return () => clearTimeout(timer)
      }
    }
  }, [activeTrade])

  return (
    <div className="flex h-screen flex-col text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-3 py-2 text-sm">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-green-500 text-xs">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
            LIVE
          </span>
          <div className="flex items-center gap-1">
            <span className="text-base">${balance.toFixed(2)}</span>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 9l-7 7-7-7" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Bell className="h-4 w-4 text-zinc-400" />
          <Link href="/deposit">
            <Button className="bg-green-500 px-4 hover:bg-green-600 text-sm">
              <Wallet className="h-4 w-4 mr-2" />
              Deposit
            </Button>
          </Link>
          <Link href="/trade-history">
            <Button variant="outline" className="text-white hover:text-white hover:bg-white/20 text-sm">
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
          </Link>
          <Button onClick={logout} variant="ghost" className="text-red-400 hover:text-red-300 text-sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative flex-1">
        <TradingChart symbol={`${currentPair.type === "Forex" ? "FX:" : ""}${currentPair.pair.replace("/", "")}`} />
      </div>

      {/* Trading Controls */}
      <TradingControls currentPair={currentPair} onMarketChange={handleMarketChange} />
      <Toaster position="top-right" />
    </div>
  )
}

