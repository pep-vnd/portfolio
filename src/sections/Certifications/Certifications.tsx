import { ExternalLink, Award } from 'lucide-react';
import { certifications } from '../../data/certifications';
import { useInView } from '../../hooks/useInView';
import styles from './Certifications.module.css';

// Inline SVG logos to avoid external image dependencies
function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function IBMLogo() {
  return (
    <svg viewBox="0 0 40 16" width="40" height="16" fill="#1F70C1">
      <rect x="0"  y="0"  width="40" height="3" rx="1.5"/>
      <rect x="5"  y="4.5" width="30" height="3" rx="1.5"/>
      <rect x="0"  y="9"  width="40" height="3" rx="1.5"/>
      <rect x="5"  y="13.5" width="30" height="3" rx="1.5"/>
    </svg>
  );
}

export default function Certifications() {
  const [ref, inView] = useInView(0.1);

  return (
    <section id="certifications" className="section">
      <div className="container">
        <div className="section-label">Credentials</div>
        <h2 className="section-title">
          Certifications &amp; <span className="accent">Learning</span>
        </h2>

        <div ref={ref} className={`${styles.grid} ${inView ? styles.visible : ''}`}>
          {certifications.map((cert, i) => {
            const r = parseInt(cert.color.slice(1, 3), 16);
            const g = parseInt(cert.color.slice(3, 5), 16);
            const b = parseInt(cert.color.slice(5, 7), 16);
            return (
              <div
                key={cert.id}
                className={styles.card}
                style={{
                  '--cert-r': r, '--cert-g': g, '--cert-b': b,
                  '--cert-color': cert.color,
                  '--delay': `${i * 0.1}s`,
                } as React.CSSProperties}
              >
                <div className={styles.cardTop}>
                  <div className={styles.logoWrap}>
                    {cert.icon === 'google' ? <GoogleLogo /> : <IBMLogo />}
                  </div>
                  <div className={styles.certMeta}>
                    <span className={styles.issuer}>{cert.issuer}</span>
                    <span className={styles.issued}>Issued {cert.issued}</span>
                  </div>
                </div>

                <div className={styles.certBody}>
                  <Award size={16} className={styles.awardIcon} strokeWidth={1.5} />
                  <h3 className={styles.certTitle}>{cert.title}</h3>
                </div>

                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.credBtn}
                  >
                    <span>View Credential</span>
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className={styles.credPending}>
                    Credential URL coming soon
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
