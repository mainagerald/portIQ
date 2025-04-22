import React from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { MarketType } from '../../services/stockService';

const MarketSelector: React.FC = () => {
  const { currentMarket, setCurrentMarket } = useMarketData();

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-md">
      <h3 className="text-white text-lg font-semibold mb-3">Select Market</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {Object.values(MarketType).map((market) => (
          <button
            key={market}
            onClick={() => setCurrentMarket(market)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentMarket === market
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            {market}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MarketSelector;
