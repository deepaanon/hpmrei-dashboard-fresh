import { useState, useEffect, useRef } from 'react'

interface MarketData {
  [symbol: string]: {
    signal: string
    score: number
    price: number
    change_24h: number
    rsi: number
    volume_24h?: number
    market_cap?: number
    timeframe_analysis?: any
  }
}

export default function Dashboard() {
  // 🚀 CACHE BUST v2.0.1 - Force Vercel refresh
  const [marketData, setMarketData] = useState<MarketData>({})
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [status, setStatus] = useState('Loading...')
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('symbol')
  const [showAddSymbol, setShowAddSymbol] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [newSymbol, setNewSymbol] = useState('')
  const [selectedSymbols, setSelectedSymbols] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const itemsPerPage = 12

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

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'STRONG_BUY': return 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg'
      case 'BUY': return 'bg-gradient-to-r from-green-300 to-green-500 text-white shadow-md'
      case 'NEUTRAL': return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-md'
      case 'SELL': return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-md'
      case 'STRONG_SELL': return 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg'
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-md'
    }
  }

  const addSymbol = async () => {
    if (!newSymbol.trim()) return
    
    try {
      const response = await fetch('/api/proxy/pairs/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: newSymbol.toUpperCase() })
      })
      
      if (response.ok) {
        setNewSymbol('')
        setShowAddSymbol(false)
        fetchData()
      } else {
        alert('Failed to add symbol')
      }
    } catch (error) {
      console.error('Error adding symbol:', error)
      alert('Error adding symbol')
    }
  }

  const removeSelectedSymbols = async () => {
    if (selectedSymbols.size === 0) return
    
    try {
      const response = await fetch('/api/proxy/pairs/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols: Array.from(selectedSymbols) })
      })
      
      if (response.ok) {
        setSelectedSymbols(new Set())
        fetchData()
      } else {
        alert('Failed to remove symbols')
      }
    } catch (error) {
      console.error('Error removing symbols:', error)
      alert('Error removing symbols')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/proxy/pairs/upload', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        setShowUpload(false)
        fetchData()
        alert('Symbols uploaded successfully!')
      } else {
        alert('Failed to upload file')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file')
    }
  }

  const toggleSymbolSelection = (symbol: string) => {
    const newSelection = new Set(selectedSymbols)
    if (newSelection.has(symbol)) {
      newSelection.delete(symbol)
    } else {
      newSelection.add(symbol)
    }
    setSelectedSymbols(newSelection)
  }

  const exportSymbols = async () => {
    try {
      const response = await fetch('/api/proxy/pairs/export')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = 'trading_pairs.csv'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting symbols:', error)
      alert('Error exporting symbols')
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
      case 'score': return bData.score - aData.score
      case 'change': return (bData.change_24h || 0) - (aData.change_24h || 0)
      default: return 0
    }
  })

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4c1d95 100%)',
      color: 'white',
      padding: '1rem'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        padding: '1.5rem',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '0.75rem',
        border: '1px solid rgba(147, 51, 234, 0.3)'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '0.75rem',
          background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 50%, #ea580c 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ✨ ENHANCED HPMREI Trading Dashboard v2.0
        </h1>
        <p style={{ color: '#d1d5db', fontSize: '1.125rem' }}>Advanced Cryptocurrency Mean Reversion Analysis</p>
      </div>

      {/* Status Bar */}
      <div className="glass-panel p-4 rounded-xl mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-xl font-semibold">{status}</span>
            <span className="text-gray-400">Last Update: {lastUpdate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full pulse-animation"></div>
            <span className="text-green-400">Live Data</span>
          </div>
        </div>
      </div>

      {/* Management Panel */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-md p-6 rounded-xl border border-gray-600/50 mb-6">
        <h3 className="text-xl font-bold mb-4 text-blue-400">📊 Portfolio Management</h3>
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => setShowAddSymbol(true)}
            className="px-4 py-2 gradient-button-green hover:opacity-90 rounded-lg font-medium transition-all duration-200 shadow-lg text-white"
          >
            ➕ Add Symbol
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="px-4 py-2 gradient-button-blue hover:opacity-90 rounded-lg font-medium transition-all duration-200 shadow-lg text-white"
          >
            📁 Upload List
          </button>
          <button
            onClick={exportSymbols}
            className="px-4 py-2 gradient-button-purple hover:opacity-90 rounded-lg font-medium transition-all duration-200 shadow-lg text-white"
          >
            💾 Export
          </button>
          {selectedSymbols.size > 0 && (
            <button
              onClick={removeSelectedSymbols}
              className="px-4 py-2 gradient-button-red hover:opacity-90 rounded-lg font-medium transition-all duration-200 shadow-lg text-white"
            >
              🗑️ Remove Selected ({selectedSymbols.size})
            </button>
          )}
        </div>
        
        {selectedSymbols.size > 0 && (
          <div className="text-sm text-blue-300">
            💡 Tip: Click on symbols to select/deselect them for bulk operations
          </div>
        )}
      </div>

      {/* Add Symbol Modal */}
      {showAddSymbol && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-600 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Add New Symbol</h3>
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
              placeholder="Enter symbol (e.g., BTCUSDT)"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 mb-4"
              onKeyPress={(e) => e.key === 'Enter' && addSymbol()}
            />
            <div className="flex gap-3">
              <button
                onClick={addSymbol}
                className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium"
              >
                Add Symbol
              </button>
              <button
                onClick={() => setShowAddSymbol(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-600 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Upload Symbol List</h3>
            <p className="text-gray-400 mb-4">Upload a CSV or TXT file with trading symbols (one per line)</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.txt"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpload(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-md p-6 rounded-xl border border-gray-600/50 mb-6">
        <h3 className="text-xl font-bold mb-4 text-blue-400">🎛️ Filters & Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Signal</label>
            <select 
              value={filter} 
              onChange={(e: any) => setFilter(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 backdrop-blur-sm"
            >
              <option value="ALL">All Signals</option>
              <option value="STRONG_BUY">🟢 Strong Buy</option>
              <option value="BUY">🟢 Buy</option>
              <option value="NEUTRAL">🟡 Neutral</option>
              <option value="SELL">🟠 Sell</option>
              <option value="STRONG_SELL">🔴 Strong Sell</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Sort by</label>
            <select 
              value={sortBy} 
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 backdrop-blur-sm"
            >
              <option value="symbol">Symbol A-Z</option>
              <option value="signal">Signal Strength</option>
              <option value="score">HPMREI Score</option>
              <option value="change">24h Change</option>
            </select>
          </div>
          
          <div className="md:col-span-2 flex items-end">
            <div className="text-sm text-gray-300">
              📈 Showing {currentData.length} of {sortedData.length} pairs 
              (Page {currentPage} of {totalPages})
            </div>
          </div>
        </div>
      </div>

      {/* Trading Pairs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        {currentData.map(([symbol, data]: [string, any]) => (
          <div 
            key={symbol} 
            className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${
              selectedSymbols.has(symbol) 
                ? 'border-blue-500 ring-2 ring-blue-500/50 bg-blue-900/20' 
                : 'border-gray-600/50 hover:border-gray-500'
            }`}
            onClick={() => toggleSymbolSelection(symbol)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="font-bold text-xl text-blue-300">{symbol}</div>
              {selectedSymbols.has(symbol) && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </div>
            
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 ${getSignalColor(data.signal)}`}>
              {data.signal.replace('_', ' ')}
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-black/20 rounded-lg p-2">
                <div className="text-gray-400 text-xs">HPMREI Score</div>
                <div className="font-bold text-lg text-cyan-400">
                  {data.score?.toFixed(3) || 'N/A'}
                </div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-2">
                <div className="text-gray-400 text-xs">Price</div>
                <div className="font-bold text-lg text-yellow-400">
                  ${data.price?.toFixed(4) || 'N/A'}
                </div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-2">
                <div className="text-gray-400 text-xs">24h Change</div>
                <div className={`font-bold text-lg ${data.change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {data.change_24h ? `${data.change_24h.toFixed(2)}%` : 'N/A'}
                </div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-2">
                <div className="text-gray-400 text-xs">RSI</div>
                <div className={`font-bold text-lg ${data.rsi > 70 ? 'text-red-400' : data.rsi < 30 ? 'text-green-400' : 'text-gray-300'}`}>
                  {data.rsi?.toFixed(1) || 'N/A'}
                </div>
              </div>
            </div>
            
            {data.volume_24h && (
              <div className="mt-3 pt-3 border-t border-gray-600/50">
                <div className="text-xs text-gray-400 mb-1">24h Volume</div>
                <div className="text-sm font-medium text-purple-400">
                  ${(data.volume_24h / 1000000).toFixed(2)}M
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-md p-4 rounded-xl border border-gray-600/50">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 disabled:from-gray-600 disabled:to-gray-700 rounded-lg font-medium transition-all duration-200"
          >
            ← Previous
          </button>
          
          <span className="px-4 py-2 bg-black/30 rounded-lg">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 disabled:from-gray-600 disabled:to-gray-700 rounded-lg font-medium transition-all duration-200"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
