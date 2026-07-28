import { useEffect, useId, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import IconButton from '@/components/shared/IconButton';
import { ApiError } from '@/services/api';
import { settingsApi } from '@/features/setting/api';
import {
  PASSWORD_MIN_LENGTH,
  OTP_LENGTH,
  OTP_RESEND_SECONDS,
  MIN_STRENGTH_SCORE,
  getPasswordStrength,
} from '@/features/setting/constants';
import formStyles from '@/components/admin/AdminForm.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';
import detailStyles from '@/components/admin/DetailPanel.module.css';
import styles from './Settings.module.css';

const EMPTY_FORM = { currentPassword: '', newPassword: '', confirmPassword: '', otp: '' };

// Shared markup for a labeled password input with a show/hide toggle —
// used three times below (current / new / confirm), kept local since it
// isn't needed anywhere outside this modal.
function PasswordField({ id, label, value, onChange, show, onToggleShow, autoComplete, error, hint, disabled }) {
  return (
    <div className={formStyles.row}>
      <label className={formStyles.label} htmlFor={id}>{label}</label>
      <div className={styles.passwordWrap}>
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className={`${controlStyles.input} ${controlStyles.fullWidth} ${styles.passwordInput}`}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          required
        />
        <IconButton
          className={styles.toggleVisibility}
          onClick={onToggleShow}
          aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </IconButton>
      </div>
      {hint && !error && <p className={styles.hint}>{hint}</p>}
      {error && <p className={styles.fieldError} role="alert">{error}</p>}
    </div>
  );
}

export default function UpdatePasswordModal({ onClose, onUpdated }) {
  const currentId = useId();
  const newId = useId();
  const confirmId = useId();
  const otpId = useId();

  const [form, setForm] = useState(EMPTY_FORM);
  const [visibility, setVisibility] = useState({ current: false, new: false, confirm: false });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);

  const [otpSent, setOtpSent] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const cooldownRef = useRef(null);

  useEffect(() => {
    if (otpCooldown <= 0) return undefined;
    cooldownRef.current = setTimeout(() => setOtpCooldown((s) => s - 1), 1000);
    return () => clearTimeout(cooldownRef.current);
  }, [otpCooldown]);

  const strength = getPasswordStrength(form.newPassword);
  const passwordsMatch = form.confirmPassword.length > 0 && form.newPassword === form.confirmPassword;
  const meetsStrength = strength.score >= MIN_STRENGTH_SCORE;

  const canSubmit =
    form.currentPassword.length > 0 &&
    meetsStrength &&
    passwordsMatch &&
    otpSent &&
    form.otp.length === OTP_LENGTH &&
    !isSaving;

  const updateField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    setFormError(null);
    try {
      await settingsApi.requestPasswordOtp();
      setOtpSent(true);
      setOtpCooldown(OTP_RESEND_SECONDS);
    } catch (err) {
      console.error('Failed to send password OTP:', err);
      setFormError('Could not send the verification code. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const nextFieldErrors = {};
    if (form.newPassword.length < PASSWORD_MIN_LENGTH) {
      nextFieldErrors.newPassword = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
    } else if (!meetsStrength) {
      nextFieldErrors.newPassword = 'Please choose a stronger password.';
    }
    if (!passwordsMatch) {
      nextFieldErrors.confirmPassword = 'Passwords do not match.';
    }
    if (form.otp.length !== OTP_LENGTH) {
      nextFieldErrors.otp = `Enter the ${OTP_LENGTH}-digit code sent to your email.`;
    }
    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    setIsSaving(true);
    try {
      await settingsApi.updatePassword(form);
      onUpdated();
    } catch (err) {
      console.error('Failed to update password:', err);
      if (err instanceof ApiError && err.status === 401) {
        setFieldErrors({ currentPassword: 'Current password is incorrect.' });
      } else if (err instanceof ApiError && err.status === 400) {
        setFieldErrors({ otp: err.body?.message || 'Invalid or expired code. Please try again.' });
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal title="Update Password" size="sm" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <PasswordField
          id={currentId}
          label="Current Password"
          value={form.currentPassword}
          onChange={updateField('currentPassword')}
          show={visibility.current}
          onToggleShow={() => setVisibility((v) => ({ ...v, current: !v.current }))}
          autoComplete="current-password"
          error={fieldErrors.currentPassword}
          disabled={isSaving}
        />

        <PasswordField
          id={newId}
          label="New Password"
          value={form.newPassword}
          onChange={updateField('newPassword')}
          show={visibility.new}
          onToggleShow={() => setVisibility((v) => ({ ...v, new: !v.new }))}
          autoComplete="new-password"
          error={fieldErrors.newPassword}
          hint="At least 8 characters, mixing case, numbers, and symbols."
          disabled={isSaving}
        />

        {form.newPassword.length > 0 && (
          <div className={styles.strengthMeter}>
            <div className={styles.strengthBar}>
              <div
                className={`${styles.strengthFill} ${styles[strength.tone]}`}
                style={{ width: `${(strength.score / 5) * 100}%` }}
              />
            </div>
            <p className={`${styles.strengthLabel} ${styles[strength.tone]}`}>{strength.label}</p>
          </div>
        )}

        <PasswordField
          id={confirmId}
          label="Confirm New Password"
          value={form.confirmPassword}
          onChange={updateField('confirmPassword')}
          show={visibility.confirm}
          onToggleShow={() => setVisibility((v) => ({ ...v, confirm: !v.confirm }))}
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
          disabled={isSaving}
        />

        <div className={formStyles.row}>
          <label className={formStyles.label} htmlFor={otpId}>Verification Code</label>
          <div className={styles.otpRow}>
            <div className={styles.passwordWrap}>
              <input
                id={otpId}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={OTP_LENGTH}
                className={`${controlStyles.input} ${controlStyles.fullWidth}`}
                value={form.otp}
                disabled={!otpSent || isSaving}
                onChange={(e) => setForm((f) => ({ ...f, otp: e.target.value.replace(/\D/g, '') }))}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSendingOtp || otpCooldown > 0 || isSaving}
              onClick={handleSendOtp}
            >
              {otpCooldown > 0 ? `Resend in ${otpCooldown}s` : otpSent ? 'Resend Code' : 'Send Code'}
            </Button>
          </div>
          {otpSent && !fieldErrors.otp && (
            <p className={styles.hint}>Code sent to your registered email.</p>
          )}
          {fieldErrors.otp && <p className={styles.fieldError} role="alert">{fieldErrors.otp}</p>}
        </div>

        {formError && <p className={styles.formError} role="alert">{formError}</p>}

        <div className={detailStyles.actions}>
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={!canSubmit} isLoading={isSaving}>
            {isSaving ? 'Updating…' : 'Update Password'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
