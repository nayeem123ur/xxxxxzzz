"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Withdrawal {
  id: number
  user: string
  amount: number
  method: string
  account: string
  status: string
  timestamp: string
}

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null)

  useEffect(() => {
    const storedWithdrawals = JSON.parse(localStorage.getItem("withdrawals") || "[]")
    setWithdrawals(storedWithdrawals)
  }, [])

  const handleApprove = (id: number) => {
    const updatedWithdrawals = withdrawals.map((withdrawal) => {
      if (withdrawal.id === id) {
        withdrawal.status = "Approved"
      }
      return withdrawal
    })
    setWithdrawals(updatedWithdrawals)
    localStorage.setItem("withdrawals", JSON.stringify(updatedWithdrawals))
    setSelectedWithdrawal(null)
  }

  const handleReject = (id: number) => {
    const updatedWithdrawals = withdrawals.map((withdrawal) => {
      if (withdrawal.id === id) {
        withdrawal.status = "Rejected"
        // Refund the user's balance
        const users = JSON.parse(localStorage.getItem("users") || "{}")
        if (users[withdrawal.user]) {
          users[withdrawal.user].balance += withdrawal.amount
          localStorage.setItem("users", JSON.stringify(users))
        }
      }
      return withdrawal
    })
    setWithdrawals(updatedWithdrawals)
    localStorage.setItem("withdrawals", JSON.stringify(updatedWithdrawals))
    setSelectedWithdrawal(null)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Withdrawals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/10 border-none shadow-lg">
          <CardHeader>
            <CardTitle>Withdrawal Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">User</TableHead>
                  <TableHead className="text-white">Amount</TableHead>
                  <TableHead className="text-white">Method</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>{withdrawal.user}</TableCell>
                    <TableCell>${withdrawal.amount.toFixed(2)}</TableCell>
                    <TableCell>{withdrawal.method}</TableCell>
                    <TableCell>{withdrawal.status}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelectedWithdrawal(withdrawal)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {selectedWithdrawal && (
          <Card className="bg-white/10 border-none shadow-lg">
            <CardHeader>
              <CardTitle>Withdrawal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>User:</strong> {selectedWithdrawal.user}
              </div>
              <div>
                <strong>Amount:</strong> ${selectedWithdrawal.amount.toFixed(2)}
              </div>
              <div>
                <strong>Method:</strong> {selectedWithdrawal.method}
              </div>
              <div>
                <strong>Account:</strong> {selectedWithdrawal.account}
              </div>
              <div>
                <strong>Status:</strong> {selectedWithdrawal.status}
              </div>
              <div>
                <strong>Timestamp:</strong> {new Date(selectedWithdrawal.timestamp).toLocaleString()}
              </div>
              {selectedWithdrawal.status === "Pending" && (
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => handleApprove(selectedWithdrawal.id)}>
                    Approve
                  </Button>
                  <Button variant="destructive" onClick={() => handleReject(selectedWithdrawal.id)}>
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

