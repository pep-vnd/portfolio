import { GitCommit, GitBranch } from 'lucide-react';

function GitHubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}
import { useInView } from '../../hooks/useInView';
import styles from './GitHubSection.module.css';

const REPOS = [
  {
    name: 'Security-Audits',
    description: 'Internal security audits, incident analysis and risk assessment using NIST CSF, PCI DSS and GDPR.',
    stars: null,
    topics: ['cybersecurity', 'nist-csf', 'security-audit', 'gdpr'],
    url: 'https://github.com/pep-vnd/Security-Audits',
    featured: true,
  },
];

export default function GitHubSection() {
  const [ref, inView] = useInView(0.1);

  return (
    <section className="section" aria-labelledby="github-heading">
      <div className="container">
        <div ref={ref} className={`${styles.wrapper} ${inView ? styles.visible : ''}`}>
          {/* Terminal-style heading */}
          <div className={styles.gitLog}>
            <span className={styles.gitCmd}>
              <GitCommit size={14} />
              <code>$ git log --security --oneline</code>
            </span>
          </div>

          <div className={styles.content}>
            <div className={styles.left}>
              <div className="section-label">GitHub</div>
              <h2 id="github-heading" className="section-title">
                Security Audits<br />
                <span className="accent">& Compliance</span>
              </h2>
              <p className="section-subtitle">
                All security work is documented and version-controlled — because transparency is part of good practice.
              </p>

              <div className={styles.userCard}>
                <div className={styles.userAvatar}>
                  <GitHubIcon size={20} />
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>pep-vnd</span>
                  <span className={styles.userSub}>github.com/pep-vnd</span>
                </div>
              </div>

              <a
                href="https://github.com/pep-vnd"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ marginTop: '0.5rem', display: 'inline-flex' }}
              >
                <GitHubIcon size={16} />
                Explore my GitHub
              </a>
            </div>

            <div className={styles.right}>
              {REPOS.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.repoCard} ${repo.featured ? styles.featured : ''}`}
                  aria-label={`${repo.name} repository`}
                >
                  <div className={styles.repoHeader}>
                    <div className={styles.repoIcon}>
                      <GitBranch size={16} strokeWidth={1.5} />
                    </div>
                    <span className={styles.repoName}>{repo.name}</span>
                    {repo.featured && (
                      <span className={styles.featuredBadge}>Featured</span>
                    )}
                  </div>
                  <p className={styles.repoDesc}>{repo.description}</p>
                  <div className={styles.repoTopics}>
                    {repo.topics.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
