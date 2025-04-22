import React from 'react';
import { MarketDataProvider } from '../context/MarketDataContext';
import MarketSelector from '../components/market/MarketSelector';
import MarketOverview from '../components/market/MarketOverview';
import TopMovers from '../components/market/TopMovers';
import StockSearch from '../components/market/StockSearch';
import MarketNews from '../components/market/MarketNews';
import SectorPerformance from '../components/market/SectorPerformance';

const MarketDashboard: React.FC = () => {
  return (
    <MarketDataProvider>
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Market Dashboard</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Market Selector */}
              <MarketSelector />
              
              {/* Market Overview */}
              <MarketOverview />
              
              {/* Top Movers */}
              <TopMovers />
              
              {/* Market News */}
              <MarketNews />
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              {/* Stock Search */}
              <StockSearch />
              
              {/* Sector Performance */}
              <SectorPerformance />
            </div>
          </div>
        </div>
      </div>
    </MarketDataProvider>
  );
};

export default MarketDashboard;
