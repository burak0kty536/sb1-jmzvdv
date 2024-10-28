import React from 'react';
import { Activity, BarChart2, Lock, Settings } from 'lucide-react';
import { TokenList } from './components/TokenList';
import { TradeExecutor } from './components/TradeExecutor';
import { SecurityAlerts } from './components/SecurityAlerts';
import { CrossChainMonitor } from './components/CrossChainMonitor';
import { PortfolioManager } from './components/PortfolioManager';

function App() {
  const networks = ['ETH', 'BSC', 'SOLANA'];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Multi-Chain Trading Bot</h1>
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Settings className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Portfolio Value</h2>
              <BarChart2 className="h-6 w-6 text-blue-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">$0.00</p>
            <p className="text-sm text-gray-500">Across all chains</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Active Trades</h2>
              <Activity className="h-6 w-6 text-green-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500">Current positions</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Security Status</h2>
              <Lock className="h-6 w-6 text-indigo-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-green-500">Secure</p>
            <p className="text-sm text-gray-500">All systems operational</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <TokenList />
            <CrossChainMonitor />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <TradeExecutor onExecuteTrade={async () => {}} />
            <SecurityAlerts tokenAddress="" networks={networks} />
            <PortfolioManager />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;