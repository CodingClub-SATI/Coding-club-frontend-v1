import styles from './Tag.module.css';

/**
 * Small pill badge used for categories, keywords, and statuses.
 * tone: 'accent' | 'secondary' | 'primary' | 'muted'
 */
export default function Tag({ children, tone = 'accent', className = '', style, ...props }) {
  return (
    <span
      className={`${styles.tag} ${styles[`tone-${tone}`]} ${className}`.trim()}
      style={style}
      {...props}
    >
      {children}
    </span>
  );
}
