import { GithubIcon, InstagramIcon, LinkedinIcon, XIcon } from '@/components/shared/Icons';
import { Modal } from '@/components/shared/Modal';
import SocialLink from '@/components/shared/SocialLink';
import Tag from '@/components/shared/Tag';
import MemberAvatar from './MemberAvatar';
import styles from './MemberProfileModal.module.css';

const SOCIAL_FIELDS = [
  { key: 'github', label: 'GitHub', Icon: GithubIcon },
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedinIcon },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'twitter', label: 'X', Icon: XIcon },
];

export default function MemberProfileModal({ member, onClose }) {
  const socials = SOCIAL_FIELDS.filter(({ key }) => member[key]);

  return (
    <Modal title={member.name} onClose={onClose} size="sm" variant="glow">
      <div className={styles.content}>
        <MemberAvatar member={member} size={88} />
        <div className={styles.role}>{member.role}</div>
        {member.designation && <div className={styles.designation}>{member.designation}</div>}
        {member.shortDescription && <p className={styles.bio}>{member.shortDescription}</p>}

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
              <SocialLink key={key} href={member[key]} label={label}>
                <Icon size={16} />
              </SocialLink>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
