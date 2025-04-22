import React from 'react';
import { useMarketData } from '../../context/MarketDataContext';

const MarketNews: React.FC = () => {
  const { marketNews, isLoading } = useMarketData();

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-md animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="bg-gray-700 h-20 w-32 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md">
      <h3 className="text-white text-xl font-semibold mb-4">Latest Market News</h3>
      
      <div className="space-y-4">
        {Array.isArray(marketNews) ? marketNews.slice(0, 6).map((news, index) => {
          // Handle different API response formats
          const title = news.title || news.headline || '';
          const url = news.url || news.link || '';
          const image = news.image || news.imageUrl || '';
          const site = news.site || news.source || '';
          const publishedDate = news.publishedDate || news.date || new Date().toISOString();
          const content = news.text || news.content || news.summary || '';
          
          return (
            <a 
              key={index} 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex space-x-4 hover:bg-gray-700/50 p-3 rounded-lg transition-colors"
            >
              {image && (
                <div className="flex-shrink-0">
                  <img 
                    src={image} 
                    alt={title} 
                    className="h-20 w-32 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'https://via.placeholder.com/128x80?text=No+Image';
                    }}
                  />
                </div>
              )}
              <div>
                <h4 className="text-white font-medium">{title}</h4>
                <p className="text-gray-400 text-sm mt-1">{site} · {formatDate(publishedDate)}</p>
                <p className="text-gray-300 text-sm mt-2 line-clamp-2">{content}</p>
              </div>
            </a>
          );
        }) : <p className="text-gray-400">No news available at the moment.</p>}
      </div>
      
      <div className="mt-4 text-center">
        <a 
          href="https://financialmodelingprep.com/financial-news" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
        >
          View More News →
        </a>
      </div>
    </div>
  );
};

export default MarketNews;
