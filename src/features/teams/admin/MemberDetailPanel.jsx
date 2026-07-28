import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import { ConfirmButton } from '@/components/shared/ConfirmButton';
import Tag from '@/components/shared/Tag';
import SocialLink from '@/components/shared/SocialLink';
import { GithubIcon, LinkedinIcon, InstagramIcon, XIcon } from '@/components/shared/Icons';
import MemberAvatar from '@/features/teams/components/MemberAvatar';
import { teamApi } from '@/features/teams/api';
import { TEAM_GROUPS } from '@/features/teams/constants';
import formStyles from '@/components/admin/AdminForm.module.css';
import detailStyles from '@/components/admin/DetailPanel.module.css';
import styles from './Teams.module.css';

const SOCIAL_FIELDS = [
  { key: 'github', label: 'GitHub', Icon: GithubIcon },
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedinIcon },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'twitter', label: 'X', Icon: XIcon },
];

export default function MemberDetailPanel({ year, group, member, onClose, onEdit, onDeleted }) {
  const [actionError, setActionError] = useState(null);
  const groupLabel = TEAM_GROUPS.find((g) => g.key === group)?.label || group;
  const socials = SOCIAL_FIELDS.filter(({ key }) => member[key]);

  const handleDelete = async () => {
    setActionError(null);
    try {
      await teamApi.removeMember(year, group, member.id);
      onDeleted();
    } catch (err) {
      console.error('Failed to delete team member:', err);
      setActionError('Could not delete this member. Please try again.');
    }
  };

  return (
    <Modal title={member.name} onClose={onClose} size="sm" variant="glow">
      <div className={styles.detailAvatar}>
        <MemberAvatar member={member} size={88} />
      </div>

      <div className={formStyles.row}>
        <span className={formStyles.label}>Role</span>
        <div>{member.role || '—'}</div>
      </div>
      <div className={formStyles.row}>
        <span className={formStyles.label}>Designation</span>
        <div>{member.designation || '—'}</div>
      </div>
      <div className={formStyles.row}>
        <span className={formStyles.label}>Year / Group</span>
        <div>{year} — {groupLabel}</div>
      </div>

      {member.shortDescription && (
        <div className={formStyles.row}>
          <span className={formStyles.label}>Short Description</span>
          <p className={styles.description}>{member.shortDescription}</p>
        </div>
      )}

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
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil size={14} aria-hidden="true" /> Update Info
        </Button>
        <ConfirmButton label="Delete Member" confirmLabel="Remove member?" danger onConfirm={handleDelete} />
      </div>
    </Modal>
  );
}
