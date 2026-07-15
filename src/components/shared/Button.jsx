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

/*
export default function ConfirmButton({ label, confirmLabel = 'Confirm?', onConfirm, danger }) {
  const [confirming, setConfirming] = useState(false);
  if (confirming) {
    return (
      <span className="admin-confirm-inline">
        <button className={`btn-small ${danger ? 'btn-danger' : ''}`} onClick={() => { setConfirming(false); onConfirm(); }}>{confirmLabel}</button>
        <button className="btn-small btn-ghost" onClick={() => setConfirming(false)}>Cancel</button>
      </span>
    );
  }
  return <button className={`btn-small ${danger ? 'btn-danger-outline' : 'btn-ghost'}`} onClick={() => setConfirming(true)}>{label}</button>;
}
  */