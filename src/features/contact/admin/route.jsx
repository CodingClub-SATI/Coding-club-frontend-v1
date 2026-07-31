import Inbox from './Inbox';
import { contactApi } from '../api';

export async function loader() {
  try {
    const contacts = await contactApi.getAll();
    return { contacts: Array.isArray(contacts) ? contacts : [], error: null };
  } catch (err) {
    console.error('Failed to load contact requests:', err);
    return { contacts: [], error: 'Could not load contact requests right now.' };
  }
}

export default Inbox;
