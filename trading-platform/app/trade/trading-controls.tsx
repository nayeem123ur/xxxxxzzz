"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-hot-toast"
import { useAuth } from "../hooks/useAuth"

interface TradingControlsProps {
  currentPair: {
    pair: string
    type: string
    percentage: string
  }
  onMarketChange: (market: string) => void
}

export default function TradingControls({ currentPair, onMarketChange }: TradingControlsProps) {
  const { balance, updateBalance, activeTrade, startTrade, endTrade } = useAuth()
  const [investment, setInvestment] = useState(1)
  const [selectedTime, setSelectedTime] = useState("1")
  const [remainingTime, setRemainingTime] = useState(60)
  const [selectedMarket, setSelectedMarket] = useState(`${currentPair.pair} (${currentPair.type})`)

  const payout = 1.9 // 90% profit

  const handleInvestmentChange = (amount: number) => {
    const newAmount = investment + amount
    if (newAmount >= 1) {
      setInvestment(newAmount)
    }
  }

  const handleMarketChange = (value: string) => {
    setSelectedMarket(value)
    onMarketChange(value)
  }

  const handleTimeChange = (value: string) => {
    setSelectedTime(value)
    setRemainingTime(Number.parseInt(value) * 60)
  }

  const canTrade = useCallback(() => {
    return balance >= investment && !activeTrade
  }, [balance, investment, activeTrade])

  const handleStartTrade = (direction: "up" | "down") => {
    if (canTrade()) {
      const newTrade = {
        id: Date.now(),
        type: direction,
        amount: investment,
        startTime: Date.now(),
        duration: Number.parseInt(selectedTime),
      }
      startTrade(newTrade)
      updateBalance(balance - investment)
      console.log(`Starting ${direction} trade for ${selectedTime} minutes`)
      toast.success(`${direction.toUpperCase()} trade started for $${investment}`)
    } else {
      console.log("Cannot start trade")
      toast.error("Cannot start trade at this time")
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (activeTrade) {
      const elapsedTime = (Date.now() - activeTrade.startTime) / 1000
      const remainingTime = activeTrade.duration * 60 - elapsedTime
      setRemainingTime(Math.max(0, Math.floor(remainingTime)))

      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            const win = Math.random() < 0.5 // 50% chance of winning
            const profitOrLoss = win ? activeTrade.amount * (payout - 1) : -activeTrade.amount
            endTrade(win ? "Profit" : "Loss", profitOrLoss)
            updateBalance(balance + (win ? activeTrade.amount + profitOrLoss : 0))
            toast.success(`Trade finished! ${win ? "You won" : "You lost"} $${Math.abs(profitOrLoss).toFixed(2)}`)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [activeTrade, balance, endTrade, updateBalance])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="border-t border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-3 rounded-b-lg shadow-lg text-sm">
      {/* Market Selector */}
      <div className="mb-3 flex items-center justify-between">
        <Select value={selectedMarket} onValueChange={handleMarketChange}>
          <SelectTrigger className="w-[180px] bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none text-xs">
            <SelectValue placeholder="Select market" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="AUD/CAD (OTC)">AUD/CAD (OTC)</SelectItem>
            <SelectItem value="EUR/USD (Forex)">EUR/USD (Forex)</SelectItem>
            <SelectItem value="BTC/USD (Crypto)">BTC/USD (Crypto)</SelectItem>
            <SelectItem value="AAPL (Stocks)">AAPL (Stocks)</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          90%
        </span>
        {activeTrade && (
          <div className="flex items-center gap-2 text-blue-400 text-xs">
            <span className="font-semibold">PENDING TRADE</span>
            <div className="h-3 w-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse" />
          </div>
        )}
      </div>

      {/* Timer and Investment */}
      <div className="mb-3 grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <span className="text-xs text-zinc-400">Timer</span>
          <Select value={selectedTime} onValueChange={handleTimeChange} disabled={!!activeTrade}>
            <SelectTrigger className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white border-none text-xs">
              <SelectValue placeholder={formatTime(remainingTime)} />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="1">1 minute</SelectItem>
              <SelectItem value="2">2 minutes</SelectItem>
              <SelectItem value="3">3 minutes</SelectItem>
              <SelectItem value="4">4 minutes</SelectItem>
              <SelectItem value="5">5 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-zinc-400">Investment</span>
          <div className="flex items-center rounded overflow-hidden bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 rounded-none border-r border-yellow-600 hover:bg-yellow-700 text-white"
              onClick={() => handleInvestmentChange(-1)}
              disabled={!!activeTrade}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <div className="flex-1 text-center text-base font-bold text-white">${investment}</div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 rounded-none border-l border-yellow-600 hover:bg-yellow-700 text-white"
              onClick={() => handleInvestmentChange(1)}
              disabled={!!activeTrade}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="mb-3 flex justify-between text-zinc-400 text-xs">
        <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Balance:
        </span>
        <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-600">
          ${balance.toFixed(2)}
        </span>
      </div>

      {/* Payout */}
      <div className="mb-3 flex justify-between text-zinc-400 text-xs">
        <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Payout:
        </span>
        <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
          ${(investment * payout).toFixed(2)}
        </span>
      </div>

      {/* Trading Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          size="sm"
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
          onClick={() => handleStartTrade("down")}
          disabled={!canTrade()}
        >
          <ChevronDown className="mr-1 h-4 w-4" />
          Down
        </Button>
        <Button
          size="sm"
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
          onClick={() => handleStartTrade("up")}
          disabled={!canTrade()}
        >
          <ChevronUp className="mr-1 h-4 w-4" />
          Up
        </Button>
      </div>

      {/* Countdown Timer */}
      {activeTrade && (
        <div className="mt-3 text-center">
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
            Trade closes in: {formatTime(remainingTime)}
          </span>
        </div>
      )}
    </div>
  )
}

