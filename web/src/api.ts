const API_HOST = import.meta.env.VITE_API_HOST;

export async function shortenUrl(url: string): Promise<string> {
  const response = await fetch(`${API_HOST}/short_it`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to shorten URL');
  }
  
  const { short_url: shortCode } = await response.json();
  return `${window.location.origin}/${shortCode}`;
}

export async function getUrlHistory(): Promise<ShortUrlRecord[]> {
  const response = await fetch(`${API_HOST}/records`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }
  
  const records = await response.json();
  return records.map((record: Record<string, string>) => {
    const [shortCode, originalUrl] = Object.entries(record)[0];
    return {
      [`${window.location.origin}/${shortCode}`]: originalUrl
    };
  });
}

export async function recoverUrl(shortCode: string): Promise<string> {
  const response = await fetch(`${API_HOST}/recover_it?short_url=${encodeURIComponent(shortCode)}`);
  
  if (!response.ok) {
    throw new Error('Failed to recover URL');
  }
  
  const data = await response.json();
  return data.original_url;
}