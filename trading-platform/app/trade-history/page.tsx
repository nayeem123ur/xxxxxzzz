"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "react-hot-toast"

interface Trade {
  id: number
  type: "up" | "down"
  amount: number
  outcome: "Profit" | "Loss"
  profitOrLoss: number
  timestamp: string
}

export default function TradeHistoryPage() {
  const { getTradeHistory, activeTrade } = useAuth()
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([])

  useEffect(() => {
    setTradeHistory(getTradeHistory())
  }, [getTradeHistory])

  useEffect(() => {
    if (activeTrade) {
      toast("You have an active trade. The trade history shown may not include your current trade.", {
        icon: "🔔",
      })
    }
  }, [activeTrade])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-zinc-900 to-blue-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/trade">
            <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
            Trade History
          </h1>
        </div>

        <Card className="bg-white/10 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Your Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">ID</TableHead>
                  <TableHead className="text-white">Type</TableHead>
                  <TableHead className="text-white">Amount</TableHead>
                  <TableHead className="text-white">Outcome</TableHead>
                  <TableHead className="text-white">Profit/Loss</TableHead>
                  <TableHead className="text-white">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tradeHistory.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>{trade.id}</TableCell>
                    <TableCell>{trade.type}</TableCell>
                    <TableCell>${trade.amount.toFixed(2)}</TableCell>
                    <TableCell>{trade.outcome}</TableCell>
                    <TableCell className={trade.profitOrLoss >= 0 ? "text-green-500" : "text-red-500"}>
                      ${trade.profitOrLoss.toFixed(2)}
                    </TableCell>
                    <TableCell>{new Date(trade.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

