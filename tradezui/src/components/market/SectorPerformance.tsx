import React from 'react';
import { useMarketData } from '../../context/MarketDataContext';

const SectorPerformance: React.FC = () => {
  const { sectorPerformance, isLoading } = useMarketData();

  // Helper function to determine color based on performance
  const getPerformanceColor = (performance: number) => {
    if (performance > 3) return 'bg-green-500';
    if (performance > 1) return 'bg-green-400';
    if (performance > 0) return 'bg-green-300';
    if (performance > -1) return 'bg-red-300';
    if (performance > -3) return 'bg-red-400';
    return 'bg-red-500';
  };

  // Helper function to determine text color based on performance
  const getTextColor = (performance: number) => {
    return performance >= 0 ? 'text-green-400' : 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-md animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md">
      <h3 className="text-white text-xl font-semibold mb-4">Sector Performance</h3>
      
      <div className="space-y-4">
        {sectorPerformance.map((sector, index) => {
          const performanceValue = parseFloat(sector.changesPercentage.replace('%', ''));
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-white">{sector.name}</span>
                <span className={getTextColor(performanceValue)}>
                  {performanceValue > 0 ? '+' : ''}{performanceValue.toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getPerformanceColor(performanceValue)}`} 
                  style={{ 
                    width: `${Math.min(Math.abs(performanceValue) * 5, 100)}%`,
                    marginLeft: performanceValue < 0 ? 'auto' : '0'
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectorPerformance;
