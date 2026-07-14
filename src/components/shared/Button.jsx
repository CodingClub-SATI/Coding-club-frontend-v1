import styles from './Button.module.css';

const Button = ({ 
  Component = 'button',
  children, 
  variant = 'primary',  // 'primary' | 'secondary' | 'outline' | 'ghost'
  size = 'md',          // 'sm' | 'md' | 'lg'
  isLoading = false, 
  className = '', 
  disabled,
  ref,
  ...props 
}) => {
  
  const baseClass = styles.btn;
  const variantClass = styles[`btn-${variant}`];
  const sizeClass = styles[`btn-${size}`];
  const loadingClass = isLoading ? styles.loaderActive : ''; 

  const combinedClasses = `${baseClass} ${variantClass} ${sizeClass} ${loadingClass} ${className}`.trim();

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