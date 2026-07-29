import { Modal } from '@/components/shared/Modal';
import SocialLink from '@/components/shared/SocialLink';
import Tag from '@/components/shared/Tag';
import { SOCIAL_FIELDS } from '@/features/teams/constants';
import MemberAvatar from './MemberAvatar';
import styles from './MemberProfileModal.module.css';

export default function MemberProfileModal({ member, onClose }) {
  const socials = SOCIAL_FIELDS.filter(({ key }) => member.socials?.[key]);

  return (
    <Modal title={member.fullName} onClose={onClose} size="sm" variant="glow">
      <div className={styles.content}>
        <MemberAvatar member={member} size={88} />
        <div className={styles.role}>{member.clubPosition}</div>
        {member.specialization && <div className={styles.designation}>{member.specialization}</div>}

        {member.skills?.length > 0 && (
          <div className={styles.skills}>
            {member.skills.map((skill) => (
              <Tag key={skill} tone="accent">{skill}</Tag>
            ))}
          </div>
        )}

        {socials.length > 0 && (
          <div className={styles.socials}>
            {socials.map(({ key, label, Icon }) => (
              <SocialLink key={key} href={member.socials[key]} label={label}>
                <Icon size={16} />
              </SocialLink>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
