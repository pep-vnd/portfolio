import { htbMachines } from '../../data/htb';
import { useInView } from '../../hooks/useInView';
import styles from './HTB.module.css';

export default function HTB() {
  const [ref, inView] = useInView(0.1);

  return (
    <section id="htb" className="section" aria-labelledby="htb-heading">
      <div className="container">
        <div ref={ref} className={`${styles.panel} ${inView ? styles.visible : ''}`}>
          {/* Header */}
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <div className={styles.htbLogo}>HTB</div>
              <div>
                <h2 id="htb-heading" className={styles.title}>Hack The Box Labs</h2>
                <p className={styles.subtitle}>Offensive Security Training</p>
              </div>
            </div>
            <div className={styles.statusChip}>
              <span className={styles.statusDot} />
              ACTIVE LEARNING
            </div>
          </div>

          <div className={styles.panelBody}>
            {/* Stats panel */}
            <div className={styles.statsRow}>
              {[
                { label: 'TARGETS', value: '—' },
                { label: 'WRITEUPS', value: '—' },
                { label: 'STATUS', value: 'TRAINING' },
                { label: 'PLATFORM', value: 'HTB' },
              ].map((s) => (
                <div key={s.label} className={styles.statItem}>
                  <span className={styles.statLabel}>{s.label}</span>
                  <span className={styles.statValue}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Coming soon message */}
            <div className={styles.comingSoon}>
              <p className={styles.comingSoonText}>
                Hands-on offensive security labs and write-ups coming soon.
              </p>
              <p className={styles.comingSoonSubtext}>
                Currently active on Hack The Box — building real offensive security skills through lab environments.
              </p>
            </div>

            {/* Machine list — renders when populated */}
            {htbMachines.length > 0 && (
              <div className={styles.machineList}>
                {htbMachines.map((machine) => (
                  <div key={machine.id} className={styles.machineRow}>
                    <div className={styles.machineName}>{machine.name}</div>
                    <span className={`${styles.diffBadge} ${styles[machine.difficulty.toLowerCase()]}`}>
                      {machine.difficulty}
                    </span>
                    <span className={styles.machineOs}>{machine.os}</span>
                    <span className={styles.machineStatus}>{machine.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
