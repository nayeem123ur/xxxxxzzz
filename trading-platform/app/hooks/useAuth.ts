"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface User {
  email: string
  password?: string
  balance: number
  status?: string
  joinedAt?: string
  lastLogin?: string
  totalDeposits?: number
  totalWithdrawals?: number
  tradeCount?: number
}

interface Trade {
  id: number
  type: "up" | "down"
  amount: number
  outcome: "Profit" | "Loss"
  profitOrLoss: number
  timestamp: string
}

interface ActiveTrade {
  id: number
  type: "up" | "down"
  amount: number
  startTime: number
  duration: number
}

interface Withdrawal {
  id: number
  user: string
  amount: number
  method: string
  account: string
  status: string
  timestamp: string
}

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const [activeTrade, setActiveTrade] = useState<ActiveTrade | null>(null)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (user) {
      setIsLoggedIn(true)
      setCurrentUser(user)
      const users = JSON.parse(localStorage.getItem("users") || "{}")
      setBalance(users[user]?.balance || 0)
      const storedActiveTrade = JSON.parse(localStorage.getItem("activeTrade") || "null")
      setActiveTrade(storedActiveTrade)
    } else {
      setIsLoggedIn(false)
      setCurrentUser(null)
      setBalance(0)
      setActiveTrade(null)
    }
  }, [])

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem("users") || "{}")
    if (users[email] && users[email].password === password) {
      localStorage.setItem("currentUser", email)
      setIsLoggedIn(true)
      setCurrentUser(email)
      setBalance(users[email].balance || 0)
      return true
    }
    return false
  }

  const register = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem("users") || "{}")
    if (users[email]) {
      return false // User already exists
    }
    users[email] = {
      password,
      balance: 0,
      tradeHistory: [],
      status: "Active",
      joinedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      totalDeposits: 0,
      totalWithdrawals: 0,
      tradeCount: 0,
    }
    localStorage.setItem("users", JSON.stringify(users))
    return true
  }

  const logout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("activeTrade")
    setIsLoggedIn(false)
    setCurrentUser(null)
    setBalance(0)
    setActiveTrade(null)
    router.push("/login")
  }

  const resetPassword = (email: string, newPassword: string): boolean => {
    const users = JSON.parse(localStorage.getItem("users") || "{}")
    if (users[email]) {
      users[email].password = newPassword
      localStorage.setItem("users", JSON.stringify(users))
      return true
    }
    return false
  }

  const updateBalance = (newBalance: number) => {
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem("users") || "{}")
      users[currentUser].balance = newBalance
      localStorage.setItem("users", JSON.stringify(users))
      setBalance(newBalance)

      // Dispatch a custom event to notify other components of the balance update
      const event = new CustomEvent("balanceUpdated", { detail: newBalance })
      window.dispatchEvent(event)
    }
  }

  const addTradeToHistory = (trade: Trade) => {
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem("users") || "{}")
      if (!users[currentUser].tradeHistory) {
        users[currentUser].tradeHistory = []
      }
      users[currentUser].tradeHistory.push(trade)
      localStorage.setItem("users", JSON.stringify(users))
    }
  }

  const getTradeHistory = useCallback((): Trade[] => {
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem("users") || "{}")
      return users[currentUser].tradeHistory || []
    }
    return []
  }, [currentUser])

  const startTrade = (trade: ActiveTrade) => {
    setActiveTrade(trade)
    localStorage.setItem("activeTrade", JSON.stringify(trade))
  }

  const endTrade = (outcome: "Profit" | "Loss", profitOrLoss: number) => {
    if (activeTrade) {
      const trade: Trade = {
        id: activeTrade.id,
        type: activeTrade.type,
        amount: activeTrade.amount,
        outcome,
        profitOrLoss,
        timestamp: new Date().toISOString(),
      }
      addTradeToHistory(trade)
      setActiveTrade(null)
      localStorage.removeItem("activeTrade")
    }
  }

  useEffect(() => {
    const handleBalanceUpdate = (event: CustomEvent) => {
      setBalance(event.detail)
    }

    window.addEventListener("balanceUpdated", handleBalanceUpdate as EventListener)

    return () => {
      window.removeEventListener("balanceUpdated", handleBalanceUpdate as EventListener)
    }
  }, [])

  const requestWithdrawal = (amount: number, method: string, account: string): boolean => {
    if (currentUser && balance >= amount) {
      const withdrawals = JSON.parse(localStorage.getItem("withdrawals") || "[]")
      const newWithdrawal: Withdrawal = {
        id: Date.now(),
        user: currentUser,
        amount,
        method,
        account,
        status: "Pending",
        timestamp: new Date().toISOString(),
      }
      withdrawals.push(newWithdrawal)
      localStorage.setItem("withdrawals", JSON.stringify(withdrawals))
      return true
    }
    return false
  }

  const getPendingDeposits = useCallback((): { amount: number; status: string }[] => {
    if (currentUser) {
      const deposits = JSON.parse(localStorage.getItem("deposits") || "[]")
      return deposits
        .filter(
          (deposit: { user: string; status: string }) => deposit.user === currentUser && deposit.status === "Pending",
        )
        .map((deposit: { amount: number; status: string }) => ({
          amount: deposit.amount,
          status: deposit.status,
        }))
    }
    return []
  }, [currentUser])

  const getWithdrawalHistory = useCallback((): Withdrawal[] => {
    if (currentUser) {
      const withdrawals = JSON.parse(localStorage.getItem("withdrawals") || "[]")
      return withdrawals.filter((withdrawal: Withdrawal) => withdrawal.user === currentUser)
    }
    return []
  }, [currentUser])

  const getAllUsers = (): User[] => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "{}")
    return Object.entries(storedUsers).map(([email, data]: [string, any]) => ({
      email,
      balance: data.balance || 0,
      status: data.status || "Active",
      joinedAt: data.joinedAt || new Date().toISOString(),
      lastLogin: data.lastLogin || new Date().toISOString(),
      totalDeposits: data.totalDeposits || 0,
      totalWithdrawals: data.totalWithdrawals || 0,
      tradeCount: data.tradeCount || 0,
    }))
  }

  return {
    isLoggedIn,
    currentUser,
    balance,
    activeTrade,
    login,
    register,
    logout,
    resetPassword,
    updateBalance,
    addTradeToHistory,
    getTradeHistory,
    startTrade,
    endTrade,
    requestWithdrawal,
    getPendingDeposits,
    getWithdrawalHistory,
    getAllUsers,
  }
}

