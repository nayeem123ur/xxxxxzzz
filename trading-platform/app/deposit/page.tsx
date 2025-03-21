"use client"

import { useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import DepositSection from "./deposit-section"
import WithdrawalSection from "./withdrawal-section"
import WithdrawalHistory from "./withdrawal-history"
import { useAuth } from "../hooks/useAuth"
import { toast } from "react-hot-toast"

export default function DepositPage() {
  const { activeTrade } = useAuth()

  useEffect(() => {
    if (activeTrade) {
      toast("You have an active trade. You can still make deposits, but please be cautious.", {
        icon: "🔔",
      })
    }
  }, [activeTrade])

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-zinc-900 to-blue-900 text-white">
      <div className="mx-auto max-w-4xl p-4">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href="/trade">
            <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
            Deposit and Withdrawal
          </h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="deposit" className="space-y-4">
          <TabsList className="w-full bg-white/10 p-1">
            <TabsTrigger
              value="deposit"
              className="w-1/4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white"
            >
              Deposit
            </TabsTrigger>
            <TabsTrigger
              value="withdrawal"
              className="w-1/4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
            >
              Withdrawal
            </TabsTrigger>
            <TabsTrigger
              value="deposit-history"
              className="w-1/4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
            >
              Deposit History
            </TabsTrigger>
            <TabsTrigger
              value="withdrawal-history"
              className="w-1/4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
            >
              Withdrawal History
            </TabsTrigger>
          </TabsList>
          <TabsContent value="deposit">
            <DepositSection />
          </TabsContent>
          <TabsContent value="withdrawal">
            <WithdrawalSection />
          </TabsContent>
          <TabsContent value="deposit-history">
            <Link href="/deposit/history">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 text-white font-bold py-3 text-lg">
                View Deposit History
              </Button>
            </Link>
          </TabsContent>
          <TabsContent value="withdrawal-history">
            <WithdrawalHistory />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

