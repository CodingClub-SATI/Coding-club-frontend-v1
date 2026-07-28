import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { getSocialLinks } from '@/data/socialLinks';
import Reveal from '@/components/shared/Reveal';
import Glasscard from '@/components/shared/Glasscard';
import Button from '@/components/shared/Button';
import { contactApi } from '@/features/contact/api';
import { REQUEST_TYPES } from '@/features/contact/constants';
import styles from './Contact.module.css';

const EMPTY_FORM = { name: '', email: '', requestType: REQUEST_TYPES[0], message: '' };

export default function Contact() {
  const { siteInfo } = useOutletContext();
  const socialLinks = getSocialLinks(siteInfo?.socials);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const updateField = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await contactApi.create(formData);
      setStatus('success');
      setFormData(EMPTY_FORM);
    } catch (err) {
      console.error('Failed to submit contact form:', err);
      setStatus('error');
    } finally {
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div>
      {/* Intro */}
      <section className="section">
        <div className="container">
          <Reveal Component="h1" className="section-title">
            Contact <span className="text-primary-glow">Us</span>
          </Reveal>
          <p className="section-subtitle">Have a question or want to collaborate? Send us a message.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {/* Info & socials */}
            <Glasscard className={styles.info}>
              <h2 className={styles.infoHeading}>Let&apos;s Connect 🚀</h2>

              <div className={styles.infoList}>
                {siteInfo?.email && (
                  <div className={styles.infoItem}>
                    <span className={`${styles.infoIcon} text-primary-glow`}>✉</span>
                    <div>
                      <div className={styles.infoLabel}>Email</div>
                      <a href={`mailto:${siteInfo.email}`} className={styles.infoValue}>{siteInfo.email}</a>
                    </div>
                  </div>
                )}
                {siteInfo?.phone && (
                  <div className={styles.infoItem}>
                    <span className={`${styles.infoIcon} text-primary-glow`}>📞</span>
                    <div>
                      <div className={styles.infoLabel}>Phone</div>
                      <div className={styles.infoValue}>{siteInfo.phone}</div>
                    </div>
                  </div>
                )}
                <div className={styles.infoItem}>
                  <span className={`${styles.infoIcon} text-primary-glow`}>📍</span>
                  <div>
                    <div className={styles.infoLabel}>Location</div>
                    <div className={styles.infoValue}>
                      Samrat Ashok Technological Institute<br />
                      Vidisha, Madhya Pradesh, India – 464001
                    </div>
                  </div>
                </div>
              </div>

              {socialLinks.length > 0 && (
                <>
                  <h3 className={styles.socialsHeading}>Our Socials</h3>
                  <div className={styles.socialTree}>
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.socialTreeLink}
                      >
                        <span className={styles.socialTreeLabel}>
                          {link.icon} {link.label}
                        </span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </Glasscard>

            {/* Form */}
            <Glasscard className={styles.formCard}>
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="contact-name">Name</label>
                  <input
                    type="text"
                    id="contact-name"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={updateField('name')}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contact-email">Email</label>
                  <input
                    type="email"
                    id="contact-email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={updateField('email')}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contact-requestType">What&apos;s this about?</label>
                  <select
                    id="contact-requestType"
                    required
                    value={formData.requestType}
                    onChange={updateField('requestType')}
                  >
                    {REQUEST_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={updateField('message')}
                  />
                </div>

                <Button type="submit" isLoading={status === 'sending'} className={styles.submitBtn}>
                  Send Message
                </Button>

                {status !== 'idle' && (
                  <p
                    className={`${styles.statusMsg} ${status === 'success' ? styles.success : ''} ${status === 'error' ? styles.error : ''}`.trim()}
                    aria-live="polite"
                  >
                    {status === 'sending' && 'Sending your message…'}
                    {status === 'success' && "Message sent — we'll be in touch soon!"}
                    {status === 'error' && 'Something went wrong. Please try again.'}
                  </p>
                )}
              </form>
            </Glasscard>
          </div>
        </div>
      </section>
    </div>
  );
}
