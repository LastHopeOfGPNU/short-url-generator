import React, { useState } from 'react';
import { Link2, History } from 'lucide-react';
import { ShortenUrl } from './components/ShortenUrl';
import { UrlHistory } from './components/UrlHistory';
import { RedirectHandler } from './components/RedirectHandler';

function App() {
  // If there's a path, handle redirect
  if (window.location.pathname !== '/') {
    return <RedirectHandler />;
  }

  const [activeTab, setActiveTab] = useState<'shorten' | 'history'>('shorten');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          URL Shortener
        </h1>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('shorten')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium ${
                  activeTab === 'shorten'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Link2 size={20} />
                Shorten URL
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium ${
                  activeTab === 'history'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <History size={20} />
                History
              </button>
            </div>
          </div>

          <div className="p-4">
            {activeTab === 'shorten' ? <ShortenUrl /> : <UrlHistory />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;