import styles from './Glasscard.module.css';

export default function Glasscard({ Component = 'div', children, className = '', ref, ...props }) {
  return (
    <Component ref={ref} className={`${styles.glassCard} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}