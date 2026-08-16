import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>
        <span className={styles.logo}>JCV</span>
        <p className={styles.copy}>
          Jose Carmona Vendoiro · Cádiz, Spain ·{' '}
          <span className={styles.built}>Built with passion and caffeine.</span>
        </p>
        <p className={styles.copy2}>© {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
}
