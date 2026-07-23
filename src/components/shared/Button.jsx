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
  
  const baseClass = styles.btn;
  const variantClass = styles[`btn-${variant}`];
  const toneClass = styles[`btn-${tone}`];
  const sizeClass = styles[`btn-${size}`];
  const loadingClass = isLoading ? styles.loaderActive : ''; 

  const combinedClasses = `${baseClass} ${variantClass} ${toneClass} ${sizeClass} ${loadingClass} ${className}`.trim();

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