"use client"

import { useSearchParams } from "next/navigation"
import WalletAddress from "../wallet-address"

export default function DepositMethodPage({ params }: { params: { method: string } }) {
  const searchParams = useSearchParams()
  const amount = searchParams.get("amount")

  if (!amount) {
    return <div>Error: Missing amount</div>
  }

  return <WalletAddress method={params.method.toLowerCase()} amount={amount} />
}

