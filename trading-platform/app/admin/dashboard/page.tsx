"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, ArrowDownToLine, ArrowUpFromLine } from "lucide-react"

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalDeposits, setTotalDeposits] = useState(0)
  const [totalWithdrawals, setTotalWithdrawals] = useState(0)
  const [totalBalance, setTotalBalance] = useState(0)

  useEffect(() => {
    // Calculate total users
    const users = JSON.parse(localStorage.getItem("users") || "{}")
    setTotalUsers(Object.keys(users).length)

    // Calculate total deposits
    const deposits = JSON.parse(localStorage.getItem("deposits") || "[]")
    const approvedDeposits = deposits
      .filter((deposit: any) => deposit.status === "Approved")
      .reduce((sum: number, deposit: any) => sum + deposit.amount, 0)
    setTotalDeposits(approvedDeposits)

    // Calculate total withdrawals
    const withdrawals = JSON.parse(localStorage.getItem("withdrawals") || "[]")
    const approvedWithdrawals = withdrawals
      .filter((withdrawal: any) => withdrawal.status === "Approved")
      .reduce((sum: number, withdrawal: any) => sum + withdrawal.amount, 0)
    setTotalWithdrawals(approvedWithdrawals)

    // Calculate total balance
    const totalBalance = Object.values(users).reduce((sum: number, user: any) => sum + (user.balance || 0), 0)
    setTotalBalance(totalBalance)
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/10 border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDeposits.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <ArrowUpFromLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalWithdrawals.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

