import React, { useEffect, useState } from 'react';
import { recoverUrl } from '../api';

export function RedirectHandler() {
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const shortCode = window.location.pathname.slice(1);
    if (shortCode) {
      handleRedirect(shortCode);
    }
  }, []);

  const handleRedirect = async (shortCode: string) => {
    try {
      const originalUrl = await recoverUrl(shortCode);
      window.location.href = originalUrl;
    } catch (err) {
      setError('Failed to redirect to the original URL');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-sm">
          <h1 className="text-xl font-semibold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Redirecting...</h1>
        <p className="text-gray-600">Please wait while we redirect you to the original URL.</p>
      </div>
    </div>
  );
}