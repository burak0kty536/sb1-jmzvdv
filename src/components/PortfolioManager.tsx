import React, { useState, useEffect } from 'react';
import { Wallet, PieChart, TrendingUp } from 'lucide-react';
import { DexScreenerAPI } from '../integrations/DexScreenerAPI';

interface Token {
  symbol: string;
  address: string;
  balance: number;
  value: number;
  priceChange24h: number;
}

interface PortfolioStats {
  totalValue: number;
  totalPnL: number;
  pnlPercentage: number;
}

export const PortfolioManager: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [stats, setStats] = useState<PortfolioStats>({
    totalValue: 0,
    totalPnL: 0,
    pnlPercentage: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      // Implementation for loading portfolio data
      setLoading(false);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded w-full mb-2"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Portfolio</h2>
        <Wallet className="text-blue-500" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Total Value</div>
          <div className="text-xl font-semibold">${stats.totalValue.toLocaleString()}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Total P&L</div>
          <div className={`text-xl font-semibold ${stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${stats.totalPnL.toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">P&L %</div>
          <div className={`text-xl font-semibold ${stats.pnlPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.pnlPercentage.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tokens.map((token) => (
              <tr key={token.address}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{token.symbol}</div>
                  <div className="text-sm text-gray-500">{token.address}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {token.balance.toFixed(6)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${token.value.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    token.priceChange24h >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};