import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { 
  Mail, MapPin, Send, MessageSquare, Phone, Copy, Check, 
  ArrowUpRight, Users, Code, Sparkles, FileText, User 
} from 'lucide-react';
import { getSocialLinks } from '@/data/socialLinks';
import Reveal from '@/components/shared/Reveal';
import Button from '@/components/shared/Button';
import { contactApi } from '@/features/contact/api';
import { REQUEST_TYPES } from '@/features/contact/constants';
import styles from './Contact.module.css';

const EMPTY_FORM = { 
  name: '', 
  email: '', 
  requestType: REQUEST_TYPES[0], 
  message: '', 
  honeypot: '' 
};

const TOPICS = [
  { id: 'Collaboration', label: 'Collaboration', icon: Users, desc: 'Events & workshops' },
  { id: 'Join Club', label: 'Join Club', icon: Code, desc: 'Become a member' },
  { id: 'Sponsorship', label: 'Sponsorship', icon: Sparkles, desc: 'Partner & support' },
  { id: 'General Inquiry', label: 'General Inquiry', icon: MessageSquare, desc: 'Questions & info' },
  { id: 'Other', label: 'Other', icon: FileText, desc: 'Miscellaneous' },
];

export default function Contact() {
  const { contactInfo } = useOutletContext();
  const socialLinks = getSocialLinks(contactInfo);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [copiedEmail, setCopiedEmail] = useState(false);

  const emailAddress = contactInfo?.email || 'codingclub@satiengg.in';
  const phoneNumber = contactInfo?.phone;

  const updateField = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const setCategory = (cat) => {
    setFormData((prev) => ({ ...prev, requestType: cat }));
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      setCopiedEmail(false);
    }
  };

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
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Background ambient lighting */}
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.ambientGlowSecondary} aria-hidden="true" />

      {/* Header Section */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroKicker}>
              <span className={styles.kickerDot} />
              <span>Reach Out & Connect</span>
            </div>
            <Reveal Component="h1" className="section-title">
              Contact & <span className={styles.gradientTitle}>Support</span>
            </Reveal>
            <p className={styles.heroSubtitle}>
              Have a project idea, question about club events, or want to collaborate? Connect with the SATI student developer core team.
            </p>
          </div>
        </div>
      </section>

      {/* Main Unified Box */}
      <section className={styles.mainSection}>
        <div className="container">
          <div className={styles.unifiedBox}>
            {/* Top gradient highlight beam */}
            <div className={styles.boxTopBeam} aria-hidden="true" />

            {/* Left Pane: Channels & Info */}
            <div className={styles.leftPane}>
              <div>
                <h2 className={styles.paneTitle}>Direct Channels</h2>
                <p className={styles.paneSubtitle}>
                  Prefer reaching out directly? Connect through our official campus desks and community servers.
                </p>
              </div>

              <div className={styles.channelsList}>
                {/* Email Card */}
                <div className={`${styles.channelCard} ${styles.emailCard}`}>
                  <div className={styles.cardHeader}>
                    <div className={styles.channelIcon}>
                      <Mail size={18} />
                    </div>
                    <span className={styles.channelBadge}>Official Email</span>
                  </div>

                  <div className={styles.channelDetails}>
                    <a href={`mailto:${emailAddress}`} className={styles.channelLink}>
                      {emailAddress}
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className={styles.copyBtn}
                    title="Copy email address"
                    aria-label="Copy email address"
                  >
                    {copiedEmail ? (
                      <span className={styles.copiedState}>
                        <Check size={13} />
                        <span>Copied!</span>
                      </span>
                    ) : (
                      <span className={styles.copyState}>
                        <Copy size={13} />
                        <span>Copy Address</span>
                      </span>
                    )}
                  </button>
                </div>

                {/* Campus Base Card */}
                <div className={`${styles.channelCard} ${styles.campusCard}`}>
                  <div className={styles.cardHeader}>
                    <div className={styles.channelIcon}>
                      <MapPin size={18} />
                    </div>
                    <span className={styles.channelBadge}>Campus Lab</span>
                  </div>

                  <div className={styles.channelDetails}>
                    <div className={styles.channelText}>
                      Department of Computer Science & Engineering<br />
                      Samrat Ashok Technological Institute<br />
                      Vidisha, Madhya Pradesh – 464001
                    </div>
                  </div>
                </div>

                {/* Phone Card */}
                {phoneNumber && (
                  <a
                    href={`tel:${phoneNumber}`}
                    className={`${styles.channelCard} ${styles.phoneCard}`}
                  >
                    <div className={styles.cardHeader}>
                      <div className={styles.channelIcon}>
                        <Phone size={18} />
                      </div>
                      <span className={styles.channelBadge}>Campus Helpline</span>
                    </div>

                    <div className={styles.channelDetails}>
                      <span className={styles.channelLink}>
                        <span>{phoneNumber}</span>
                        <ArrowUpRight size={14} className={styles.arrowIcon} />
                      </span>
                    </div>
                  </a>
                )}
              </div>

              {/* Redesigned Official Social Channels */}
              <div className={styles.socialSection}>
                <div className={styles.socialSectionHeader}>
                  <span className={styles.socialKickerDot} />
                  <h3 className={styles.socialSectionTitle}>Official Social Channels</h3>
                </div>
                <p className={styles.socialSectionSubtitle}>
                  Join our discussions, view event captures, and connect with fellow student developers.
                </p>

                <div className={styles.socialCardGrid}>
                  {socialLinks.map((link) => (
                    <a
                      key={link.key}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`${styles.socialCard} ${styles[`socialCard_${link.key}`] || ''}`}
                      title={`Visit Coding Club SATI on ${link.label}`}
                    >
                      <div className={styles.socialCardLeft}>
                        <div className={styles.socialCardIcon}>
                          {link.icon}
                        </div>
                        <div className={styles.socialCardMeta}>
                          <span className={styles.socialCardName}>{link.label}</span>
                          <span className={styles.socialCardHandle}>{link.handle}</span>
                        </div>
                      </div>
                      <div className={styles.socialCardAction} aria-hidden="true">
                        <ArrowUpRight size={14} className={styles.socialCardArrow} />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Pane: Message Form */}
            <div className={styles.rightPane}>
              <div>
                <h2 className={styles.paneTitle}>Send a Message</h2>
                <p className={styles.paneSubtitle}>
                  Select your inquiry topic below and send us your details. We will respond back to your email.
                </p>
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                {/* Interactive Topic Selector Grid */}
                <div className={styles.topicSection}>
                  <label className={styles.fieldLabel}>
                    <span>Inquiry Topic</span>
                    <span className={styles.labelSub}>Select one</span>
                  </label>

                  <div className={styles.topicGrid} role="radiogroup" aria-label="Inquiry Topic">
                    {TOPICS.map((topic) => {
                      const isSelected = formData.requestType === topic.id;
                      const Icon = topic.icon;
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => setCategory(topic.id)}
                          className={`${styles.topicTile} ${isSelected ? styles.topicTileActive : ''}`}
                        >
                          <div className={styles.topicIconBox}>
                            <Icon size={16} />
                          </div>
                          <div className={styles.topicMeta}>
                            <span className={styles.topicTitle}>{topic.label}</span>
                            <span className={styles.topicDesc}>{topic.desc}</span>
                          </div>
                          <div className={styles.topicIndicator} aria-hidden="true" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name & Email Fields */}
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="contact-name" className={styles.fieldLabel}>
                      <span>Your Name</span>
                      <span className={styles.requiredMark}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <User size={15} className={styles.inputIcon} />
                      <input
                        type="text"
                        id="contact-name"
                        required
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={updateField('name')}
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="contact-email" className={styles.fieldLabel}>
                      <span>Email Address</span>
                      <span className={styles.requiredMark}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <Mail size={15} className={styles.inputIcon} />
                      <input
                        type="email"
                        id="contact-email"
                        required
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={updateField('email')}
                      />
                    </div>
                  </div>
                </div>

                {/* Message Textarea */}
                <div className={styles.field}>
                  <div className={styles.labelRow}>
                    <label htmlFor="contact-message" className={styles.fieldLabel}>
                      <span>Message</span>
                      <span className={styles.requiredMark}>*</span>
                    </label>
                    <span className={styles.counter}>{formData.message.length} / 2000</span>
                  </div>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    maxLength={2000}
                    placeholder="Tell us what you're thinking or how we can help..."
                    value={formData.message}
                    onChange={updateField('message')}
                  />
                </div>

                {/* Honeypot anti-spam trap */}
                <div className={styles.honeypot} aria-hidden="true">
                  <label htmlFor="contact-honeypot">Leave blank</label>
                  <input
                    type="text"
                    id="contact-honeypot"
                    name="honeypot"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.honeypot}
                    onChange={updateField('honeypot')}
                  />
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  isLoading={status === 'sending'}
                  className={styles.submitBtn}
                  variant="filled"
                  tone="primary"
                >
                  <span>Send Message</span>
                  <Send size={15} className={styles.submitIcon} />
                </Button>

                {/* Feedback Alerts */}
                {status === 'success' && (
                  <div className={styles.successBanner} role="status">
                    <Check size={16} className={styles.bannerIcon} />
                    <div>
                      <strong>Message Delivered!</strong>
                      <span>Thank you for reaching out. A team member will reply to your email shortly.</span>
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className={styles.errorBanner} role="alert">
                    <span className={styles.bannerIcon}>✕</span>
                    <div>
                      <strong>Unable to send message.</strong>
                      <span>Please check your network or email directly at {emailAddress}.</span>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
