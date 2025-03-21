"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowDownToLine, DollarSign, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface Deposit {
  id: number
  user: string
  amount: number
  method: string
  status: string
  screenshot: string
  timestamp: string
}

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const storedDeposits = JSON.parse(localStorage.getItem("deposits") || "[]")
    setDeposits(storedDeposits)
  }, [])

  const handleApprove = (id: number) => {
    const updatedDeposits = deposits.map((deposit) => {
      if (deposit.id === id) {
        deposit.status = "Approved"
        // Update user's balance
        const users = JSON.parse(localStorage.getItem("users") || "{}")
        if (users[deposit.user]) {
          users[deposit.user].balance = (users[deposit.user].balance || 0) + deposit.amount
          localStorage.setItem("users", JSON.stringify(users))

          // Update live balance if the user is currently logged in
          const currentUser = localStorage.getItem("currentUser")
          if (currentUser === deposit.user) {
            const event = new CustomEvent("balanceUpdated", { detail: users[deposit.user].balance })
            window.dispatchEvent(event)
          }
        }
      }
      return deposit
    })
    setDeposits(updatedDeposits)
    localStorage.setItem("deposits", JSON.stringify(updatedDeposits))
    setSelectedDeposit(null)
  }

  const handleReject = (id: number) => {
    const updatedDeposits = deposits.map((deposit) => {
      if (deposit.id === id) {
        deposit.status = "Rejected"
      }
      return deposit
    })
    setDeposits(updatedDeposits)
    localStorage.setItem("deposits", JSON.stringify(updatedDeposits))
    setSelectedDeposit(null)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-500/20 text-green-500"
      case "pending":
        return "bg-yellow-500/20 text-yellow-500"
      case "rejected":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  const filteredDeposits = deposits.filter(
    (deposit) =>
      deposit.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deposit.method.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalDeposits = deposits.reduce(
    (sum, deposit) => (deposit.status === "Approved" ? sum + deposit.amount : sum),
    0,
  )
  const pendingDeposits = deposits.filter((deposit) => deposit.status === "Pending").length
  const totalUsers = new Set(deposits.map((deposit) => deposit.user)).size

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Deposits</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search deposits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-[300px] bg-white/10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/10 border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDeposits.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Deposits</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDeposits}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/10 border-none">
          <CardHeader>
            <CardTitle>Deposit Requests</CardTitle>
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
                {filteredDeposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell>{deposit.user}</TableCell>
                    <TableCell>${deposit.amount.toFixed(2)}</TableCell>
                    <TableCell>{deposit.method}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(deposit.status)}>{deposit.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelectedDeposit(deposit)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {selectedDeposit && (
          <Card className="bg-white/10 border-none">
            <CardHeader>
              <CardTitle>Deposit Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">User</div>
                  <div className="font-medium">{selectedDeposit.user}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Amount</div>
                  <div className="font-medium">${selectedDeposit.amount.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Method</div>
                  <div className="font-medium">{selectedDeposit.method}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <Badge className={getStatusColor(selectedDeposit.status)}>{selectedDeposit.status}</Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="font-medium">{new Date(selectedDeposit.timestamp).toLocaleString()}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">Screenshot</div>
                <div className="relative h-[200px] w-full rounded-lg overflow-hidden">
                  <Image
                    src={selectedDeposit.screenshot || "/placeholder.svg"}
                    alt="Deposit Screenshot"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              {selectedDeposit.status === "Pending" && (
                <div className="flex space-x-4">
                  <Button
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                    onClick={() => handleApprove(selectedDeposit.id)}
                  >
                    Approve
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => handleReject(selectedDeposit.id)}>
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

