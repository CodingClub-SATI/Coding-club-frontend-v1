import { useId, useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import ParticleBackground from '@/components/public/ParticleBackground';
import Glasscard from '@/components/shared/Glasscard';
import Button from '@/components/shared/Button';
import IconButton from '@/components/shared/IconButton';
import { authApi } from '@/features/auth/api';
import { ApiError } from '@/services/api';
import { setSession } from '@/services/authToken';
import formStyles from '@/components/admin/AdminForm.module.css';
import fieldStyles from '@/components/admin/FormControl.module.css';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const usernameId = useId();
  const passwordId = useId();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { token } = await authApi.login(username.trim(), password);
      setSession(token, username.trim());
      navigate('/admin', { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Incorrect username or password.');
      } else {
        setError('Could not reach the server. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <ParticleBackground />

      <Glasscard className={styles.card}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <Lock size={20} />
          </div>
          <h1 className={styles.title}>Admin Login</h1>
          <p className={styles.subtitle}>Sign in to manage the club&apos;s site.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={formStyles.row}>
            <label htmlFor={usernameId} className={formStyles.label}>Username</label>
            <div className={styles.inputWrap}>
              <User size={16} className={styles.inputIcon} aria-hidden="true" />
              <input
                id={usernameId}
                className={`${fieldStyles.input} ${styles.input}`}
                type="text"
                autoComplete="username"
                required
                autoFocus
                disabled={submitting}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className={formStyles.row}>
            <label htmlFor={passwordId} className={formStyles.label}>Password</label>
            <div className={styles.inputWrap}>
              <Lock size={16} className={styles.inputIcon} aria-hidden="true" />
              <input
                id={passwordId}
                className={`${fieldStyles.input} ${styles.input} ${styles.passwordInput}`}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                disabled={submitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <IconButton
                className={styles.toggleVisibility}
                onClick={() => setShowPassword((s) => !s)}
                disabled={submitting}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </IconButton>
            </div>
          </div>

          {error && (
            <p className={styles.error} role="alert">{error}</p>
          )}

          <Button type="submit" className={styles.submit} isLoading={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </Glasscard>
    </div>
  );
}
