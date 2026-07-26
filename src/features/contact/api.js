import { request } from '@/services/api';

export const contactApi = {
  create: (payload) => request('/api/contacts', { method: 'POST', body: payload }),
};
