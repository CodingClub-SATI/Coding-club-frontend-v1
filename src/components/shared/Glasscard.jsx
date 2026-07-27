import { forwardRef } from 'react';
import styles from './Glasscard.module.css';

const Glasscard = forwardRef(function Glasscard(
  { Component = 'div', children, className = '', ...props },
  ref
) {
  return (
    <Component ref={ref} className={`${styles.glassCard} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
});

export default Glasscard;