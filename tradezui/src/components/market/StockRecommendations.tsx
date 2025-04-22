import React, { useState, useEffect } from 'react';
import { useMarketData } from '../../context/MarketDataContext';

interface StockRecommendationProps {
  symbol: string;
}

const StockRecommendations: React.FC<StockRecommendationProps> = ({ symbol }) => {
  const { getStockRecommendations } = useMarketData();
  const [recommendation, setRecommendation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendation = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getStockRecommendations(symbol);
        setRecommendation(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch recommendation');
        console.error('Error fetching recommendation:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (symbol) {
      fetchRecommendation();
    }
  }, [symbol, getStockRecommendations]);

  // Get background color based on recommendation
  const getRecommendationColor = (rec: string) => {
    switch (rec.toLowerCase()) {
      case 'buy':
        return 'bg-green-500/20 border-green-500 text-green-400';
      case 'sell':
        return 'bg-red-500/20 border-red-500 text-red-400';
      default:
        return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-md animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-24 bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-white text-xl font-semibold mb-4">Stock Recommendation</h3>
        <div className="bg-red-900/30 text-red-400 p-4 rounded-lg border border-red-800">
          <p>Error loading recommendation: {error}</p>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-white text-xl font-semibold mb-4">Stock Recommendation</h3>
        <p className="text-gray-400">No recommendation data available for {symbol}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md">
      <h3 className="text-white text-xl font-semibold mb-4">Stock Recommendation</h3>
      
      <div className={`p-4 rounded-lg border ${getRecommendationColor(recommendation.recommendation)}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-white text-lg font-medium">{symbol}</span>
          <span className="font-bold text-xl">{recommendation.recommendation}</span>
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-300 text-sm font-medium">Reasoning:</p>
          <ul className="list-disc list-inside text-gray-300 text-sm pl-2">
            {recommendation.reasoning.map((reason: string, index: number) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-700">
          <p className="text-gray-400 text-xs">This is a simple algorithmic recommendation based on technical indicators. Always do your own research before making investment decisions.</p>
        </div>
      </div>
    </div>
  );
};

export default StockRecommendations;
