import { useState, useEffect } from 'react'

interface MarketData {
  [symbol: string]: {
    signal: string
    score: number
    price: number
    change_24h: number
    rsi: number
  }
}

export default function Dashboard() {
  const [marketData, setMarketData] = useState<MarketData>({})
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [status, setStatus] = useState('Loading...')
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('symbol')
  const itemsPerPage = 12

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/proxy/data')
        const data = await response.json()
        
        if (response.ok && data.data) {
          setMarketData(data.data)
          setLastUpdate(new Date().toLocaleTimeString())
          setStatus('✅ Connected')
        } else {
          setStatus('❌ Data Error')
        }
      } catch (error) {
        console.error('Fetch error:', error)
        setStatus('❌ Connection Error')
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'STRONG_BUY': return 'bg-green-500 text-black'
      case 'BUY': return 'bg-green-300 text-black'
      case 'NEUTRAL': return 'bg-yellow-400 text-black'
      case 'SELL': return 'bg-orange-400 text-black'
      case 'STRONG_SELL': return 'bg-red-500 text-white'
      default: return 'bg-gray-400 text-black'
    }
  }

  // Filter and sort data
  const filteredData = Object.entries(marketData).filter(([symbol, data]: [string, any]) => {
    if (filter === 'ALL') return true
    return data.signal === filter
  })

  const sortedData = filteredData.sort(([aSymbol, aData]: [string, any], [bSymbol, bData]: [string, any]) => {
    switch (sortBy) {
      case 'symbol': return aSymbol.localeCompare(bSymbol)
      case 'signal': return aData.signal.localeCompare(bData.signal)
      case 'score': return aData.score - bData.score
      case 'change': return (bData.change_24h || 0) - (aData.change_24h || 0)
      default: return 0
    }
  })

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="min-h-screen bg-trading-bg text-white p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">🚀 HPMREI Trading Dashboard</h1>
        <p className="text-gray-400">Cryptocurrency Mean Reversion Signals</p>
      </div>

      {/* Status Bar */}
      <div className="bg-trading-card p-4 rounded-lg border border-trading-border mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg">{status}</span>
          <span className="text-gray-400">Last Update: {lastUpdate}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-trading-card p-4 rounded-lg border border-trading-border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Signal</label>
            <select 
              value={filter} 
              onChange={(e: any) => setFilter(e.target.value)}
              className="w-full bg-trading-bg border border-trading-border rounded px-3 py-2"
            >
              <option value="ALL">All Signals</option>
              <option value="STRONG_BUY">Strong Buy</option>
              <option value="BUY">Buy</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="SELL">Sell</option>
              <option value="STRONG_SELL">Strong Sell</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Sort by</label>
            <select 
              value={sortBy} 
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-trading-bg border border-trading-border rounded px-3 py-2"
            >
              <option value="symbol">Symbol</option>
              <option value="signal">Signal</option>
              <option value="score">Score</option>
              <option value="change">24h Change</option>
            </select>
          </div>
          
          <div className="md:col-span-2 flex items-end">
            <div className="text-sm text-gray-400">
              Showing {currentData.length} of {sortedData.length} pairs 
              (Page {currentPage} of {totalPages})
            </div>
          </div>
        </div>
      </div>

      {/* Trading Pairs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {currentData.map(([symbol, data]: [string, any]) => (
          <div key={symbol} className="bg-trading-card border border-trading-border rounded-lg p-4">
            <div className="font-bold text-lg mb-2">{symbol}</div>
            <div className={`inline-block px-3 py-1 rounded text-sm font-medium mb-2 ${getSignalColor(data.signal)}`}>
              {data.signal}
            </div>
            <div className="space-y-1 text-sm">
              <div>📊 Score: {data.score?.toFixed(3) || 'N/A'}</div>
              <div>💰 Price: ${data.price?.toFixed(4) || 'N/A'}</div>
              <div>📈 24h: {data.change_24h ? `${data.change_24h.toFixed(2)}%` : 'N/A'}</div>
              <div>🎯 RSI: {data.rsi?.toFixed(1) || 'N/A'}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-trading-card border border-trading-border rounded disabled:opacity-50"
          >
            ← Previous
          </button>
          
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-trading-card border border-trading-border rounded disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-8 text-gray-400 text-sm">
        <p>🔒 Secure HPMREI Dashboard | ⚠️ Not Financial Advice</p>
      </div>
    </div>
  )
}
