import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import { ConfirmButton } from '@/components/shared/ConfirmButton';
import Tag from '@/components/shared/Tag';
import SocialLink from '@/components/shared/SocialLink';
import MemberAvatar from '@/features/teams/components/MemberAvatar';
import { teamApi } from '@/features/teams/api';
import { SOCIAL_FIELDS } from '@/features/teams/constants';
import formStyles from '@/components/admin/AdminForm.module.css';
import detailStyles from '@/components/admin/DetailPanel.module.css';
import badgeStyles from '@/components/admin/Badge.module.css';
import styles from './Teams.module.css';

export default function MemberDetailPanel({ member, onClose, onEdit, onDeleted }) {
  const [actionError, setActionError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const socials = SOCIAL_FIELDS.filter(({ key }) => member[key]);

  const handleDelete = async () => {
    setActionError(null);
    setIsDeleting(true);
    try {
      await teamApi.removeMember(member.id);
      onDeleted(member);
    } catch (err) {
      console.error('Failed to delete team member:', err);
      setActionError('Could not delete this member. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <Modal title={member.fullName} onClose={onClose} size="sm" variant="glow">
      <div className={styles.detailAvatar}>
        <MemberAvatar member={member} size={88} />
      </div>

      {member.isLeadership && (
        <div className={styles.leadershipRow}>
          <span className={`${badgeStyles.badge} ${badgeStyles.featured}`}>Shown in leadership section</span>
        </div>
      )}

      <div className={formStyles.row}>
        <span className={formStyles.label}>Position</span>
        <div>{member.clubPosition || '—'}</div>
      </div>
      <div className={formStyles.row}>
        <span className={formStyles.label}>Specialization</span>
        <div>{member.specialization || '—'}</div>
      </div>
      <div className={formStyles.row}>
        <span className={formStyles.label}>Batch</span>
        <div>{member.batch}</div>
      </div>

      {member.skills?.length > 0 && (
        <div className={formStyles.row}>
          <span className={formStyles.label}>Skills</span>
          <div className={styles.tagList}>
            {member.skills.map((skill) => <Tag key={skill} tone="accent">{skill}</Tag>)}
          </div>
        </div>
      )}

      {socials.length > 0 && (
        <div className={styles.socialRow}>
          {socials.map(({ key, label, Icon }) => (
            <SocialLink key={key} href={member[key]} label={label}><Icon size={16} /></SocialLink>
          ))}
        </div>
      )}

      {actionError && <p className={styles.formError} role="alert">{actionError}</p>}

      <div className={detailStyles.actions}>
        <Button variant="outline" size="sm" disabled={isDeleting} onClick={onEdit}>
          <Pencil size={14} aria-hidden="true" /> Update Info
        </Button>
        <ConfirmButton label="Delete Member" confirmLabel="Remove member?" danger onConfirm={handleDelete} disabled={isDeleting} />
      </div>
    </Modal>
  );
}
