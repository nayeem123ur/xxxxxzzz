"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "../hooks/useAuth"

interface Withdrawal {
  id: number
  amount: number
  method: string
  status: string
  timestamp: string
}

export default function WithdrawalHistory() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const { getWithdrawalHistory } = useAuth()

  useEffect(() => {
    setWithdrawals(getWithdrawalHistory())
  }, [getWithdrawalHistory])

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
    <Card className="bg-white/10 border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Your Withdrawals</CardTitle>
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
            {withdrawals.map((withdrawal) => (
              <TableRow key={withdrawal.id}>
                <TableCell>${withdrawal.amount.toFixed(2)}</TableCell>
                <TableCell>{withdrawal.method}</TableCell>
                <TableCell className={getStatusColor(withdrawal.status)}>{withdrawal.status}</TableCell>
                <TableCell>{new Date(withdrawal.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

