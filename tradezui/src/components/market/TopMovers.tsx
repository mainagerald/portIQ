import React from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { Link } from 'react-router-dom';

const TopMovers: React.FC = () => {
  const { topMovers, isLoading } = useMarketData();

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-md animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="h-5 bg-gray-700 rounded w-1/4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-700 h-12 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-3">
            <div className="h-5 bg-gray-700 rounded w-1/4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-700 h-12 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md">
      <h3 className="text-white text-xl font-semibold mb-4">Top Market Movers</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div>
          <h4 className="text-green-400 font-medium mb-3">Top Gainers</h4>
          <div className="space-y-2">
            {topMovers.gainers.slice(0, 5).map((stock) => (
              <Link 
                key={stock.symbol} 
                to={`/stock/${stock.symbol}`}
                className="flex items-center justify-between bg-gray-700/50 hover:bg-gray-700 p-3 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <div className="mr-3 w-8 h-8 bg-green-600/20 text-green-400 rounded-full flex items-center justify-center font-bold">
                    {stock.symbol ? stock.symbol.charAt(0) : '?'}
                  </div>
                  <div>
                    <p className="text-white font-medium">{stock.symbol || 'Unknown'}</p>
                    <p className="text-gray-400 text-xs">{stock.name || 'Unknown Company'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white">${stock.price ? stock.price.toFixed(2) : '0.00'}</p>
                  <p className="text-green-400">+{stock.changesPercentage ? stock.changesPercentage.toFixed(2) : '0.00'}%</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Top Losers */}
        <div>
          <h4 className="text-red-400 font-medium mb-3">Top Losers</h4>
          <div className="space-y-2">
            {topMovers.losers.slice(0, 5).map((stock) => (
              <Link 
                key={stock.symbol} 
                to={`/stock/${stock.symbol}`}
                className="flex items-center justify-between bg-gray-700/50 hover:bg-gray-700 p-3 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <div className="mr-3 w-8 h-8 bg-red-600/20 text-red-400 rounded-full flex items-center justify-center font-bold">
                    {stock.symbol ? stock.symbol.charAt(0) : '?'}
                  </div>
                  <div>
                    <p className="text-white font-medium">{stock.symbol || 'Unknown'}</p>
                    <p className="text-gray-400 text-xs">{stock.name || 'Unknown Company'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white">${stock.price ? stock.price.toFixed(2) : '0.00'}</p>
                  <p className="text-red-400">{stock.changesPercentage ? stock.changesPercentage.toFixed(2) : '0.00'}%</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopMovers;
