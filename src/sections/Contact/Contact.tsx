import { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useInView } from '../../hooks/useInView';
import styles from './Contact.module.css';

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const [ref, inView] = useInView(0.05);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Formspree integration — replace YOUR_FORM_ID with your actual Formspree endpoint
    // Get a free endpoint at https://formspree.io
    const FORMSPREE_ID = 'YOUR_FORM_ID';

    if (FORMSPREE_ID === 'YOUR_FORM_ID') {
      // Demo mode — show success UI without sending
      setTimeout(() => {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      }, 1000);
      return;
    }

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section" aria-labelledby="contact-heading">
      {/* Top ambient */}
      <div className={styles.ambient} aria-hidden="true" />

      <div className="container">
        <div ref={ref} className={`${styles.wrapper} ${inView ? styles.visible : ''}`}>
          {/* Header */}
          <div className={styles.header}>
            <div className="section-label">Contact</div>
            <h2 id="contact-heading" className={`section-title ${styles.bigTitle}`}>
              Let's build something<br />
              <span className="accent">secure.</span>
            </h2>
            <p className="section-subtitle">
              Open to cybersecurity opportunities, technical projects and collaborations.
            </p>

            {/* Social CTAs */}
            <div className={styles.socialLinks}>
              <a
                href="https://www.linkedin.com/in/jose-carmona-vendoiro-47b8b0342/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                aria-label="Connect on LinkedIn"
              >
                <LinkedInIcon size={16} />
                LinkedIn
              </a>
              <a
                href="https://github.com/pep-vnd"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                aria-label="Visit GitHub"
              >
                <GitHubIcon size={16} />
                GitHub
              </a>
              <a
                href="mailto:jose@example.com"
                className="btn btn-secondary"
                aria-label="Send email"
              >
                <Mail size={16} strokeWidth={1.5} />
                Email
              </a>
            </div>
          </div>

          {/* Form */}
          <div className={styles.formWrap}>
            {status === 'success' ? (
              <div className={styles.successState}>
                <CheckCircle size={40} className={styles.successIcon} strokeWidth={1.5} />
                <h3>Message sent successfully</h3>
                <p>Thanks for reaching out. I'll get back to you as soon as possible.</p>
                <button
                  className="btn btn-secondary"
                  onClick={() => setStatus('idle')}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className={styles.form}
                noValidate
              >
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="contact-name" className={styles.label}>Name</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      className={styles.input}
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="contact-email" className={styles.label}>Email</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      className={styles.input}
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contact-subject" className={styles.label}>Subject</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    className={styles.input}
                    placeholder="What's this about?"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contact-message" className={styles.label}>Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="Tell me about the project or opportunity..."
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                  />
                </div>

                {status === 'error' && (
                  <div className={styles.errorMsg} role="alert">
                    <AlertCircle size={14} />
                    Something went wrong. Please try again or contact directly via LinkedIn.
                  </div>
                )}

                <button
                  type="submit"
                  className={`btn btn-primary ${styles.submitBtn}`}
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <>
                      <span className={styles.spinner} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} strokeWidth={1.5} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
