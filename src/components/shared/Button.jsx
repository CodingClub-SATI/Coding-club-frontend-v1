import styles from './Button.module.css';

/**
 * variant: 'filled' | 'outline' | 'ghost'
 * tone: 'primary' | 'secondary' | 'danger'
 * size: 'sm' | 'md' | 'lg'
 */

const Button = ({ 
  Component = 'button',
  children, 
  variant = 'filled',
  tone = 'primary',
  size = 'md', 
  isLoading = false, 
  className = '', 
  disabled,
  ref,
  ...props 
}) => {
  
  const combinedClasses = `
    ${styles.btn} 
    ${styles[variant]} 
    ${styles[tone]} 
    ${styles[size]} 
    ${className}
  `.trim();

  return (
    <Component 
      ref={ref}
      className={combinedClasses}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && <span className={styles.loader} aria-hidden="true"></span>}
      <span className={styles.btnContent}>{children}</span>
    </Component>
  );
};

Button.displayName = 'Button';
export default Button;