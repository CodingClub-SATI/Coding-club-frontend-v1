import styles from './Toggle.module.css';

export default function Toggle({ checked, onChange, label }) {
  return (
    <label className="admin-toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="admin-toggle-track"><span className="admin-toggle-thumb" /></span>
      {label && <span className="admin-toggle-label">{label}</span>}
    </label>
  );
}