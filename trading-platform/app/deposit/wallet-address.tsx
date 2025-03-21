"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Check, Copy, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useAuth } from "../hooks/useAuth"
import { useRouter } from "next/navigation"

interface WalletAddressProps {
  method: string
  amount: string
}

export default function WalletAddress({ method, amount }: WalletAddressProps) {
  const [copied, setCopied] = useState(false)
  const [address, setAddress] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const { currentUser } = useAuth()
  const router = useRouter()

  const methodInfo = {
    binance: {
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3220935d7c57f0f620a1a168225be1f32d4764ca5620240f92f0479f72cee31a_200-CyKCQ3Pj2qZy6Q94Iah1bQ2zvOucIa.webp",
      title: "Binance Wallet Address",
    },
    bkash: {
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5e6ab3fa58a91-BbAMlxhf1SXdKsyMR1nazsa87I9C0b.png",
      title: "Bkash Account Number",
    },
    nagad: {
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unnamed-el099RmtYkXOUCkUonIKYAgO0KH04M.png",
      title: "Nagad Account Number",
    },
  }

  useEffect(() => {
    const storedWallets = JSON.parse(localStorage.getItem("adminWallets") || "{}")
    setAddress(storedWallets[method] || "Address not set")
  }, [method])

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
    }
  }

  const handleUpload = () => {
    if (file && currentUser) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        const deposits = JSON.parse(localStorage.getItem("deposits") || "[]")
        deposits.push({
          id: Date.now(),
          user: currentUser,
          amount: Number(amount),
          method,
          status: "Pending",
          screenshot: base64String,
          timestamp: new Date().toISOString(),
        })
        localStorage.setItem("deposits", JSON.stringify(deposits))
        alert("Deposit request submitted successfully! Waiting for admin approval.")
        router.push("/deposit/history")
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-zinc-900 to-blue-900 text-white p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/deposit">
            <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
            Deposit via {method}
          </h1>
        </div>

        <Card className="bg-white/10 border-none shadow-lg mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <img src={methodInfo[method].logo || "/placeholder.svg"} alt={method} className="w-12 h-12" />
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
                {methodInfo[method].title}
              </CardTitle>
            </div>
            <CardDescription className="text-white/70">Use the following address to make your deposit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white/5 p-4 rounded-lg break-all text-lg font-mono mb-4">{address}</div>
            <Button
              className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 transition-all duration-300 text-white font-bold py-3 text-lg mb-4"
              onClick={handleCopyAddress}
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-5 w-5" />
                  Copy Address
                </>
              )}
            </Button>
            <div className="text-center mb-4">
              <p className="text-lg font-semibold">Amount to Deposit</p>
              <p className="text-3xl font-bold">${amount} USD</p>
            </div>
            <div className="space-y-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="screenshot-upload"
                accept="image/*"
              />
              <label
                htmlFor="screenshot-upload"
                className="w-full flex items-center justify-center px-4 py-2 border border-white rounded-md shadow-sm text-sm font-medium text-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
              >
                <Upload className="mr-2 h-5 w-5" />
                {file ? file.name : "Upload Transaction Screenshot"}
              </label>
              {file && (
                <Button
                  onClick={handleUpload}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 text-white font-bold py-2 text-lg"
                >
                  Submit Deposit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

