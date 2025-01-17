import React, { useEffect, useState } from 'react';
import { getUrlHistory } from '../api';
import type { ShortUrlRecord } from '../types';
import { ExternalLink } from 'lucide-react';

export function UrlHistory() {
  const [history, setHistory] = useState<ShortUrlRecord[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const records = await getUrlHistory();
      setHistory(records);
    } catch (err) {
      setError('Failed to load URL history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full text-center py-8">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {history.length === 0 ? (
        <div className="text-center text-gray-500">
          No shortened URLs yet
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record, index) => {
            const [shortUrl, originalUrl] = Object.entries(record)[0];
            return (
              <div
                key={index}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 font-medium block truncate"
                    >
                      {shortUrl}
                    </a>
                    <p className="text-gray-500 text-sm truncate">
                      {originalUrl}
                    </p>
                  </div>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Open link"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}