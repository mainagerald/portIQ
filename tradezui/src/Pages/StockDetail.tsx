import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMarketData } from '../context/MarketDataContext';
import StockChart from '../components/market/StockChart';
import StockRecommendations from '../components/market/StockRecommendations';
import stockService from '../services/stockService';
import { CompanyProfile, CompanyKeyMetrics } from '../data/company';

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { getCompanyProfile } = useMarketData();
  
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [metrics, setMetrics] = useState<CompanyKeyMetrics | null>(null);
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      if (!symbol) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch company profile
        const profileData = await getCompanyProfile(symbol);
        setProfile(profileData);
        
        // Fetch key metrics
        const metricsData = await stockService.getKeyMetrics(symbol);
        setMetrics(metricsData);
        
        // Fetch historical price data
        const historicalPrices = await stockService.getHistoricalPrices(symbol);
        setHistoricalData(historicalPrices);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch stock data');
        console.error('Error fetching stock data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStockData();
  }, [symbol, getCompanyProfile]);

  // Format large numbers
  const formatNumber = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  // Format percentage
  const formatPercentage = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Prepare chart data
  const chartData = historicalData?.historical?.map((item: any) => ({
    date: item.date,
    close: item.close,
    open: item.open,
    high: item.high,
    low: item.low,
    volume: item.volume
  })) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-800 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2">
                <div className="bg-gray-800 h-96 rounded-lg"></div>
              </div>
              <div>
                <div className="bg-gray-800 h-96 rounded-lg"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 h-64 rounded-lg"></div>
              <div className="bg-gray-800 h-64 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-6 shadow-md">
            <h3 className="text-red-400 text-lg font-semibold mb-2">Error Loading Stock Data</h3>
            <p className="text-red-300">{error || 'Failed to load stock data'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stock Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="flex items-center">
              {profile.image && (
                <img 
                  src={profile.image} 
                  alt={profile.companyName} 
                  className="w-12 h-12 rounded-full mr-4 object-contain bg-white p-1"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `https://ui-avatars.com/api/?name=${profile.symbol}&background=6366F1&color=fff`;
                  }}
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-white">{profile.companyName} ({profile.symbol})</h1>
                <p className="text-gray-400">{profile.exchange} • {profile.sector} • {profile.industry}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-white mr-3">${profile.price.toFixed(2)}</span>
              <span className={`text-lg font-medium ${profile.changes >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {profile.changes >= 0 ? '+' : ''}{profile.changes.toFixed(2)} ({(profile.changes / (profile.price - profile.changes) * 100).toFixed(2)}%)
              </span>
            </div>
            <p className="text-gray-400 text-sm">Range: {profile.range}</p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart and Time Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Time Controls */}
            <div className="bg-gray-800 rounded-lg p-4 shadow-md">
              <div className="flex space-x-2">
                <button
                  onClick={() => setTimeframe('daily')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${timeframe === 'daily'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setTimeframe('weekly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${timeframe === 'weekly'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeframe('monthly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${timeframe === 'monthly'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  Monthly
                </button>
              </div>
            </div>
            
            {/* Chart */}
            <StockChart data={chartData} />
            
            {/* Company Description */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-white text-xl font-semibold mb-4">About {profile.companyName}</h3>
              <p className="text-gray-300">{profile.description}</p>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Website
                </a>
                <div className="text-gray-300 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  CEO: {profile.ceo || 'N/A'}
                </div>
                <div className="text-gray-300 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {profile.city}, {profile.state}
                </div>
                <div className="text-gray-300 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Employees: {profile.fullTimeEmployees || 'N/A'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stock Recommendation */}
            {symbol && <StockRecommendations symbol={symbol} />}
            
            {/* Key Metrics */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-white text-xl font-semibold mb-4">Key Metrics</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Market Cap</span>
                  <span className="text-white font-medium">{formatNumber(profile.mktCap)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">P/E Ratio</span>
                  <span className="text-white font-medium">{metrics?.peRatioTTM?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dividend Yield</span>
                  <span className="text-white font-medium">{metrics?.dividendYieldPercentageTTM ? `${metrics.dividendYieldPercentageTTM.toFixed(2)}%` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Beta</span>
                  <span className="text-white font-medium">{profile.beta?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">52 Week High</span>
                  <span className="text-white font-medium">${profile.range?.split('-')[1]?.trim() || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">52 Week Low</span>
                  <span className="text-white font-medium">${profile.range?.split('-')[0]?.trim() || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Volume</span>
                  <span className="text-white font-medium">{profile.volAvg?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ROE</span>
                  <span className="text-white font-medium">{metrics?.roeTTM ? formatPercentage(metrics.roeTTM * 100) : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Profit Margin</span>
                  <span className="text-white font-medium">{metrics?.netIncomePerShareTTM ? formatPercentage(metrics.netIncomePerShareTTM * 100) : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
