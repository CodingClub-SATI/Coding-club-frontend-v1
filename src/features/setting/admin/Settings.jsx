import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useLoaderData, useNavigate, useRevalidator } from 'react-router';
import AdminTitle from '@/components/admin/AdminTitle';
import Button from '@/components/shared/Button';
import { getUsername, clearSession } from '@/services/authToken';
import UpdatePasswordModal from './UpdatePasswordModal';
import ContactInfoSection from './ContactInfoSection';
import formStyles from '@/components/admin/AdminForm.module.css';
import styles from './Settings.module.css';

export default function Settings() {
  const { contactInfo, error } = useLoaderData();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // A successful password change bumps the account's session version on the
  // server, which invalidates the cookie for THIS session too — there's no
  // "still logged in" state to return to. Rather than show a success toast
  // and let the user get silently bounced by the global 401 handler on their
  // next click, send them to login now with an explanation.
  const handleUpdated = async () => {
    setIsModalOpen(false);
    await clearSession();
    navigate('/admin/login', {
      replace: true,
      state: { message: 'Password updated. Please sign in again.' },
    });
  };

  const handleContactInfoUpdated = () => {
    revalidator.revalidate();
  };

  return (
    <div>
      <AdminTitle title="Settings" subtitle="Manage your admin account and site details." />

      <div className={styles.sectionsStack}>
        <ContactInfoSection
          contactInfo={contactInfo}
          error={error}
          onUpdated={handleContactInfoUpdated}
        />

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Profile</h2>

          <div className={formStyles.row}>
            <span className={formStyles.label}>Username</span>
            <div>{getUsername() || '—'}</div>
          </div>

          <div className={formStyles.row}>
            <span className={formStyles.label}>Password</span>
            <div className={styles.passwordRow}>
              <span className={styles.passwordDots}>••••••••</span>
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                <KeyRound size={14} aria-hidden="true" /> Update Password
              </Button>
            </div>
          </div>
        </section>
      </div>

      {isModalOpen && (
        <UpdatePasswordModal onClose={() => setIsModalOpen(false)} onUpdated={handleUpdated} />
      )}
    </div>
  );
}
