import { useInView } from '../../hooks/useInView';
import styles from './About.module.css';

const PILLARS = [
  { number: '01', label: 'Cybersecurity' },
  { number: '02', label: 'Engineering' },
  { number: '03', label: 'Project Management' },
  { number: '04', label: 'Continuous Learning' },
];

export default function About() {
  const [ref, inView] = useInView(0.1);

  return (
    <section id="about" className="section">
      <div className="container">
        <div
          ref={ref}
          className={`${styles.grid} ${inView ? styles.visible : ''}`}
        >
          {/* Left — pillars */}
          <div className={styles.pillars}>
            <div className={styles.pillarsLabel}>
              <span className="section-label">Expertise Areas</span>
            </div>
            <ul className={styles.pillarList}>
              {PILLARS.map((p, i) => (
                <li
                  key={p.number}
                  className={styles.pillar}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <span className={styles.pillarNum}>{p.number}</span>
                  <span className={styles.pillarBar} />
                  <span className={styles.pillarLabel}>{p.label}</span>
                </li>
              ))}
            </ul>

            {/* Quick stats */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>3</span>
                <span className={styles.statLabel}>Security Audits</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>2</span>
                <span className={styles.statLabel}>Certifications</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>UCA</span>
                <span className={styles.statLabel}>Universidad de Cádiz</span>
              </div>
            </div>
          </div>

          {/* Right — bio */}
          <div className={styles.bio}>
            <div className="section-label">About Me</div>
            <h2 className="section-title">
              Bridging technical security<br />
              <span className="accent">and project leadership.</span>
            </h2>

            <div className={styles.paragraphs}>
              <p>
                I am a Computer Engineering student at the University of Cádiz with a strong focus
                on the intersection of technical security and project leadership. My goal is to bridge
                the gap between complex software systems and strategic management.
              </p>
              <p>
                Currently deepening my expertise in Cybersecurity and Agile Project Management —
                developing a mindset that prioritizes both system integrity and efficient delivery.
                I am passionate about how robust architectures and well-organized workflows can
                drive innovation in international environments.
              </p>
              <p>
                I am also the Founder and Developer of{' '}
                <a
                  href="https://conil.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.inlineLink}
                >
                  conil.com
                </a>
                , where I apply my technical knowledge in a real-world business environment —
                balancing user experience with secure and scalable development.
              </p>
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Location</span>
                <span className={styles.infoValue}>Cádiz, Andalucía, Spain</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Focus</span>
                <span className={styles.infoValue}>Cybersecurity · Project Management</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Languages</span>
                <span className={styles.infoValue}>Spanish (Native) · English (B2)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
