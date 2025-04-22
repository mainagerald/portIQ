import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import stockService, { MarketType } from '../services/stockService';
import { CompanySearch, CompanyProfile } from '../data/company';

interface MarketDataContextType {
  currentMarket: MarketType;
  setCurrentMarket: (market: MarketType) => void;
  marketData: any[];
  isLoading: boolean;
  error: string | null;
  topMovers: {
    gainers: any[];
    losers: any[];
  };
  marketNews: any[];
  sectorPerformance: any[];
  searchCompanies: (query: string) => Promise<CompanySearch[]>;
  getCompanyProfile: (symbol: string) => Promise<CompanyProfile>;
  getStockRecommendations: (symbol: string) => Promise<any>;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

export const MarketDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentMarket, setCurrentMarket] = useState<MarketType>(MarketType.NASDAQ);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [topMovers, setTopMovers] = useState<{ gainers: any[]; losers: any[] }>({ gainers: [], losers: [] });
  const [marketNews, setMarketNews] = useState<any[]>([]);
  const [sectorPerformance, setSectorPerformance] = useState<any[]>([]);

  // Fetch market data when the selected market changes
  useEffect(() => {
    const fetchMarketData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await stockService.getMarketData(currentMarket);
        setMarketData(data);
        
        // Also fetch top movers, news, and sector performance
        const moversData = await stockService.getTopMovers();
        setTopMovers(moversData);
        
        const newsData = await stockService.getMarketNews();
        setMarketNews(newsData);
        
        const sectorData = await stockService.getSectorPerformance();
        setSectorPerformance(sectorData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch market data');
        console.error('Error fetching market data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, [currentMarket]);

  // Search companies
  const searchCompanies = async (query: string): Promise<CompanySearch[]> => {
    try {
      return await stockService.searchCompanies(query);
    } catch (err) {
      console.error('Error searching companies:', err);
      return [];
    }
  };

  // Get company profile
  const getCompanyProfile = async (symbol: string): Promise<CompanyProfile> => {
    try {
      return await stockService.getCompanyProfile(symbol);
    } catch (err) {
      console.error('Error fetching company profile:', err);
      throw err;
    }
  };

  // Get stock recommendations
  const getStockRecommendations = async (symbol: string) => {
    try {
      return await stockService.getStockRecommendations(symbol);
    } catch (err) {
      console.error('Error fetching stock recommendations:', err);
      throw err;
    }
  };

  const value = {
    currentMarket,
    setCurrentMarket,
    marketData,
    isLoading,
    error,
    topMovers,
    marketNews,
    sectorPerformance,
    searchCompanies,
    getCompanyProfile,
    getStockRecommendations
  };

  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  );
};

// Custom hook to use the market data context
export const useMarketData = () => {
  const context = useContext(MarketDataContext);
  if (context === undefined) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
};
