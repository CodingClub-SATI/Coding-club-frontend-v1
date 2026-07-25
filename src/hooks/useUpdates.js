import { useState, useEffect } from 'react';

export function useUpdates() {
  const [updates, setUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUpdates() {
      try {
        setIsLoading(true);
        // TODO: Replace with your actual backend API endpoint
        const response = await fetch('/api/updates', { signal: controller.signal });
        if (!response.ok) throw new Error('Failed to fetch updates');
        
        const data = await response.json();
        setUpdates(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchUpdates();

    return () => controller.abort();
  }, []);

  return { updates, isLoading, error };
}