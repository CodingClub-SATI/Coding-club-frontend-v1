import { request } from '@/services/api';

export const homeApi = {
  getStats: () => request('/api/stats'),
};
