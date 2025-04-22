import React from 'react';
import { useMarketData } from '../../context/MarketDataContext';

const MarketOverview: React.FC = () => {
  const { currentMarket, marketData, isLoading, error } = useMarketData();

  // Calculate market statistics
  const calculateStats = () => {
    if (!marketData || marketData.length === 0) return null;

    const totalMarketCap = marketData.reduce((sum, stock) => sum + (stock.mktCap || 0), 0);
    const averagePrice = marketData.reduce((sum, stock) => sum + (stock.price || 0), 0) / marketData.length;
    const averageVolume = marketData.reduce((sum, stock) => sum + (stock.volAvg || 0), 0) / marketData.length;

    return {
      totalMarketCap: formatCurrency(totalMarketCap),
      averagePrice: formatCurrency(averagePrice),
      averageVolume: formatNumber(averageVolume),
      totalCompanies: marketData.length
    };
  };

  // Format currency values
  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  };

  // Format number values
  const formatNumber = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toFixed(0);
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-md animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-700 h-24 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-500 rounded-lg p-6 shadow-md">
        <h3 className="text-red-400 text-lg font-semibold mb-2">Error Loading Market Data</h3>
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md">
      <h3 className="text-white text-xl font-semibold mb-4">{currentMarket} Market Overview</h3>
      
      {stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Market Cap</p>
            <p className="text-white text-2xl font-bold">{stats.totalMarketCap}</p>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Average Price</p>
            <p className="text-white text-2xl font-bold">{stats.averagePrice}</p>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Average Volume</p>
            <p className="text-white text-2xl font-bold">{stats.averageVolume}</p>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Listed Companies</p>
            <p className="text-white text-2xl font-bold">{stats.totalCompanies}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-400">No data available for {currentMarket}</p>
      )}
    </div>
  );
};

export default MarketOverview;
