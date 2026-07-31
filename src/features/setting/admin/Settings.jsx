import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useLoaderData, useRevalidator } from 'react-router';
import AdminTitle from '@/components/admin/AdminTitle';
import Button from '@/components/shared/Button';
import { getUsername } from '@/services/authToken';
import UpdatePasswordModal from './UpdatePasswordModal';
import ContactInfoSection from './ContactInfoSection';
import formStyles from '@/components/admin/AdminForm.module.css';
import styles from './Settings.module.css';

export default function Settings() {
  const { contactInfo, error } = useLoaderData();
  const revalidator = useRevalidator();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const handleUpdated = () => {
    setIsModalOpen(false);
    setConfirmation('Password updated successfully.');
    setTimeout(() => setConfirmation(null), 5000);
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

          {confirmation && <p className={styles.successMsg} role="status">{confirmation}</p>}
        </section>
      </div>

      {isModalOpen && (
        <UpdatePasswordModal onClose={() => setIsModalOpen(false)} onUpdated={handleUpdated} />
      )}
    </div>
  );
}
