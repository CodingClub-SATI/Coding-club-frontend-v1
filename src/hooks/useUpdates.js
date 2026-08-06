import { useState, useEffect } from 'react';
import { updatesApi } from '@/features/updates/api';

export function useUpdates() {
  const [updates, setUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUpdates() {
      try {
        setIsLoading(true);
        const data = await updatesApi.list({ signal: controller.signal });
        setUpdates(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to load alerts:', err);
          setError('Could not load alerts right now.');
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