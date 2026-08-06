import styles from './SocialLink.module.css';

export default function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className={styles.socialLink}
    >
      {children}
    </a>
  );
}