import { request } from '@/services/api';

export const dashboardApi = {
  getStats: () => request('/api/admin/stats'),
};