"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { useAuth } from "../../hooks/useAuth"

interface Deposit {
  id: number
  amount: number
  method: string
  status: string
  timestamp: string
}

export default function DepositHistoryPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const { currentUser } = useAuth()

  useEffect(() => {
    if (currentUser) {
      const allDeposits = JSON.parse(localStorage.getItem("deposits") || "[]")
      const userDeposits = allDeposits
        .filter((deposit: Deposit) => deposit.user === currentUser)
        .sort((a: Deposit, b: Deposit) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setDeposits(userDeposits)
    }
  }, [currentUser])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "text-green-500"
      case "pending":
        return "text-yellow-500"
      case "rejected":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-zinc-900 to-blue-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/deposit">
            <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
            Deposit History
          </h1>
        </div>

        <Card className="bg-white/10 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Your Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Amount</TableHead>
                  <TableHead className="text-white">Method</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell>${deposit.amount.toFixed(2)}</TableCell>
                    <TableCell>{deposit.method}</TableCell>
                    <TableCell className={getStatusColor(deposit.status)}>{deposit.status}</TableCell>
                    <TableCell>{new Date(deposit.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

