import styles from './Glasscard.module.css';

/**
 * Reusable glassmorphism card wrapper. Renders as a <div> by default;
 * pass Component to render as something else (e.g. "article", "section").
 */
export default function Glasscard({ Component = 'div', children, className = '', ...props }) {
  return (
    <Component className={`${styles.glassCard} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}
