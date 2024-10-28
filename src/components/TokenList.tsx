import React, { useState, useEffect } from 'react';
import { DexScreenerAPI } from '../integrations/DexScreenerAPI';
import { SecurityChecker } from '../security/SecurityChecker';

interface Token {
  address: string;
  symbol: string;
  price: number;
  volume24h: number;
  securityScore: number;
}

export const TokenList: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const dexScreener = new DexScreenerAPI();
  const securityChecker = new SecurityChecker();

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      const topTokens = await dexScreener.getTopTokens();
      const tokensWithSecurity = await Promise.all(
        topTokens.map(async (token) => ({
          ...token,
          securityScore: await securityChecker.analyzeToken(token.address)
        }))
      );
      setTokens(tokensWithSecurity);
    } catch (error) {
      console.error('Failed to load tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded w-full mb-2"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Token
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              24h Volume
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Security Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tokens.map((token) => (
            <tr key={token.address}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{token.symbol}</div>
                <div className="text-sm text-gray-500">{token.address}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">${token.price.toFixed(6)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">${token.volume24h.toLocaleString()}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold
                  ${token.securityScore >= 80 ? 'bg-green-100 text-green-800' :
                    token.securityScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`}>
                  {token.securityScore}/100
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900 mr-4">Buy</button>
                <button className="text-red-600 hover:text-red-900">Sell</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};