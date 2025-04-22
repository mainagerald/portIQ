import axios from 'axios';
import { 
  CompanyProfile, 
  CompanySearch, 
  CompanyKeyMetrics, 
  CompanyHistoricalDividend,
  CompanyIncomeStatement,
  CompanyBalanceSheet,
  CompanyCashFlow,
  CompanyCompData,
  CompanyTenK
} from '../data/company';

// FMP API base URL and key
const FMP_API_BASE_URL = 'https://financialmodelingprep.com/api/v3';
const FMP_API_KEY = import.meta.env.VITE_FMP_KEY || '';

// Market types for switching between different exchanges
export enum MarketType {
  NASDAQ = 'NASDAQ',
  NYSE = 'NYSE',
  LSE = 'LSE', // London Stock Exchange
  TSE = 'TSE', // Tokyo Stock Exchange
  NSE = 'NSE'  // Nairobi Securities Exchange
}

// Used in the UI for market selection
export const MARKET_NAMES = {
  [MarketType.NASDAQ]: 'NASDAQ (US)',
  [MarketType.NYSE]: 'New York Stock Exchange',
  [MarketType.LSE]: 'London Stock Exchange',
  [MarketType.TSE]: 'Tokyo Stock Exchange',
  [MarketType.NSE]: 'Nairobi Securities Exchange'
}

// Stock data service for fetching market and company data
export const stockService = {
  // Get stock market data for a specific exchange
  getMarketData: async (market: MarketType) => {
    try {
      const response = await axios.get(
        `${FMP_API_BASE_URL}/stock-screener?exchange=${market}&apikey=${FMP_API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  },

  // Search for companies by name or symbol
  searchCompanies: async (query: string): Promise<CompanySearch[]> => {
    try {
      const response = await axios.get(
        `${FMP_API_BASE_URL}/search?query=${query}&limit=10&exchange=NASDAQ&apikey=${FMP_API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error('Error searching companies:', error);
      return [];
    }
  },

  // Get company profile data
  getCompanyProfile: async (symbol: string): Promise<CompanyProfile> => {
    try {
      const response = await axios.get<CompanyProfile[]>(
        `${FMP_API_BASE_URL}/profile/${symbol}?apikey=${FMP_API_KEY}`
      );
      return response.data[0];
    } catch (error) {
      console.error('Error fetching company profile:', error);
      throw error;
    }
  },

  // Get historical stock price data
  getHistoricalPrices: async (symbol: string) => {
    try {
      const response = await axios.get(
        `${FMP_API_BASE_URL}/historical-price-full/${symbol}?timeseries=365&apikey=${FMP_API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching historical prices:', error);
      throw error;
    }
  },

  // Get top gainers and losers
  getTopMovers: async () => {
    try {
      // Fetch gainers
      const gainers = await axios.get(
        `${FMP_API_BASE_URL}/gainers?apikey=${FMP_API_KEY}`
      );
      
      // Fetch losers
      const losers = await axios.get(
        `${FMP_API_BASE_URL}/losers?apikey=${FMP_API_KEY}`
      );
      
      // Normalize the data to ensure it has the expected structure
      const normalizeStockData = (stocks: any[]): any[] => {
        if (!Array.isArray(stocks)) return [];
        
        return stocks.map(stock => ({
          symbol: stock.symbol || stock.ticker || '',
          name: stock.name || stock.companyName || '',
          price: typeof stock.price === 'number' ? stock.price : 
                 typeof stock.price === 'string' ? parseFloat(stock.price) : 0,
          changesPercentage: typeof stock.changesPercentage === 'number' ? stock.changesPercentage : 
                            typeof stock.changesPercentage === 'string' ? parseFloat(stock.changesPercentage) : 0
        }));
      };
      
      return {
        gainers: normalizeStockData(gainers.data),
        losers: normalizeStockData(losers.data)
      };
    } catch (error) {
      console.error('Error fetching top movers:', error);
      // Return empty arrays instead of throwing to prevent UI errors
      return {
        gainers: [],
        losers: []
      };
    }
  },

  // Get company key metrics
  getKeyMetrics: async (symbol: string): Promise<CompanyKeyMetrics> => {
    try {
      const response = await axios.get<CompanyKeyMetrics[]>(
        `${FMP_API_BASE_URL}/key-metrics-ttm/${symbol}?limit=40&apikey=${FMP_API_KEY}`
      );
      return response.data[0];
    } catch (error) {
      console.error('Error fetching company metrics:', error);
      throw error;
    }
  },

  // Get company dividends
  getHistoricalDividend: async (symbol: string): Promise<CompanyHistoricalDividend> => {
    try {
      const response = await axios.get<CompanyHistoricalDividend>(
        `${FMP_API_BASE_URL}/historical-price-full/stock_dividend/${symbol}?apikey=${FMP_API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching company dividends:', error);
      throw error;
    }
  },
  
  // Get income statement
  getIncomeStatement: async (symbol: string): Promise<CompanyIncomeStatement[]> => {
    try {
      const response = await axios.get<CompanyIncomeStatement[]>(
        `${FMP_API_BASE_URL}/income-statement/${symbol}?limit=50&apikey=${FMP_API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching income statement:', error);
      throw error;
    }
  },
  
  // Get balance sheet
  getBalanceSheet: async (symbol: string): Promise<CompanyBalanceSheet[]> => {
    try {
      const response = await axios.get<CompanyBalanceSheet[]>(
        `${FMP_API_BASE_URL}/balance-sheet-statement/${symbol}?limit=20&apikey=${FMP_API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching balance sheet:', error);
      throw error;
    }
  },
  
  // Get cash flow statement
  getCashFlow: async (symbol: string): Promise<CompanyCashFlow[]> => {
    try {
      const response = await axios.get<CompanyCashFlow[]>(
        `${FMP_API_BASE_URL}/cash-flow-statement/${symbol}?limit=100&apikey=${FMP_API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching cash flow statement:', error);
      throw error;
    }
  },
  
  // Get company peers data
  getCompData: async (symbol: string): Promise<CompanyCompData[]> => {
    try {
      const response = await axios.get<CompanyCompData[]>(
        `${FMP_API_BASE_URL}/v4/stock_peers?symbol=${symbol}&apikey=${FMP_API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching company peers data:', error);
      throw error;
    }
  },
  
  // Get company 10-K filings
  getTenK: async (symbol: string): Promise<CompanyTenK[]> => {
    try {
      const response = await axios.get<CompanyTenK[]>(
        `${FMP_API_BASE_URL}/sec_filings/${symbol}?type=10-K&page=0&apikey=${FMP_API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching 10-K filings:', error);
      throw error;
    }
  },

  // Get market news
  getMarketNews: async (limit: number = 5) => {
    try {
      const response = await axios.get(
        `${FMP_API_BASE_URL}/fmp/articles?page=0&size=${limit}&apikey=${FMP_API_KEY}`
      );
      
      // Ensure we always return an array
      if (!response.data) {
        return [];
      }
      
      // Handle case where the API returns an object with content property
      if (response.data.content && Array.isArray(response.data.content)) {
        return response.data.content;
      }
      
      // Handle case where the API returns an array directly
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // If we get here, we don't know the structure, so log it and return empty array
      console.log('Unexpected news data structure:', response.data);
      return [];
    } catch (error) {
      console.error('Error fetching market news:', error);
      // Return empty array instead of throwing to prevent UI errors
      return [];
    }
  },

  // Get sector performance
  getSectorPerformance: async () => {
    try {
      const response = await axios.get(
        `${FMP_API_BASE_URL}/sector-performance?apikey=${FMP_API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching sector performance:', error);
      throw error;
    }
  },

  // Get simple recommendations based on technical indicators
  getStockRecommendations: async (symbol: string) => {
    try {
      const response = await axios.get(
        `${FMP_API_BASE_URL}/technical_indicator/daily/${symbol}?period=10&type=sma,ema,wma,rsi&apikey=${FMP_API_KEY}`
      );
      
      // Simple recommendation logic based on RSI and moving averages
      const data = response.data;
      let recommendation = 'Hold';
      const reasoning = [];
      
      // Check the most recent data point
      if (data && data.length > 0) {
        const latest = data[0];
        
        // RSI-based recommendation
        if (latest.rsi < 30) {
          recommendation = 'Buy';
          reasoning.push('RSI indicates oversold conditions');
        } else if (latest.rsi > 70) {
          recommendation = 'Sell';
          reasoning.push('RSI indicates overbought conditions');
        }
        
        // Moving average crossover
        if (latest.sma > latest.ema) {
          if (recommendation !== 'Sell') {
            recommendation = 'Buy';
          }
          reasoning.push('SMA is above EMA, indicating potential uptrend');
        } else if (latest.sma < latest.ema) {
          if (recommendation !== 'Buy') {
            recommendation = 'Sell';
          }
          reasoning.push('SMA is below EMA, indicating potential downtrend');
        }
      }
      
      return {
        symbol,
        recommendation,
        reasoning,
        technicalData: data
      };
    } catch (error) {
      console.error('Error fetching stock recommendations:', error);
      throw error;
    }
  }
};

export default stockService;
