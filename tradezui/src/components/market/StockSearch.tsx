import React, { useState, useEffect, useRef } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { Link } from 'react-router-dom';
import { CompanySearch } from '../../data/company';

const StockSearch: React.FC = () => {
  const { searchCompanies } = useMarketData();
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<CompanySearch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Search for companies when query changes
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsLoading(true);
        try {
          const searchResults = await searchCompanies(query);
          setResults(searchResults);
          setShowResults(true);
        } catch (error) {
          console.error('Error searching companies:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [query, searchCompanies]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md" ref={searchRef}>
      <h3 className="text-white text-xl font-semibold mb-4">Search Stocks</h3>
      
      <div className="relative">
        <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by symbol or company name"
            className="bg-transparent border-none w-full text-white focus:outline-none ml-2"
            value={query}
            onChange={handleSearchChange}
          />
          {isLoading && (
            <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </div>
        
        {showResults && results.length > 0 && (
          <div className="absolute z-10 mt-2 w-full bg-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {results.map((company) => (
              <Link
                key={company.symbol}
                to={`/stock/${company.symbol}`}
                className="block px-4 py-3 hover:bg-gray-600 transition-colors border-b border-gray-600 last:border-0"
                onClick={() => setShowResults(false)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{company.symbol}</p>
                    <p className="text-gray-400 text-sm">{company.name}</p>
                  </div>
                  <div className="text-gray-300 text-xs">{company.exchangeShortName}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {showResults && query.trim().length > 1 && results.length === 0 && !isLoading && (
          <div className="absolute z-10 mt-2 w-full bg-gray-700 rounded-lg shadow-lg p-4">
            <p className="text-gray-300 text-center">No results found for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockSearch;
