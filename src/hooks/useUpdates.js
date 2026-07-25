import { useState, useEffect } from 'react';
import { request } from '@/services/api';

export function useUpdates() {
  const [updates, setUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUpdates() {
      try {
        setIsLoading(true);
        const data = await request('/api/updates', { signal: controller.signal });
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