"use client"

import { useEffect, useRef } from "react"

interface TradingChartProps {
  symbol: string
}

export default function TradingChart({ symbol }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    script.onload = () => {
      if (typeof TradingView !== "undefined" && containerRef.current) {
        new TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: "1",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#1f2937",
          enable_publishing: false,
          hide_top_toolbar: true,
          container_id: containerRef.current.id,
        })
      }
    }
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [symbol])

  return <div id="trading-chart" ref={containerRef} className="h-full w-full" />
}

